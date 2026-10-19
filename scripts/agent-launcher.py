#!/usr/bin/env python3
"""Launch a ReactEdge specialist in a separate Codex CLI session.

This is a subprocess launcher, not Codex's native spawn-agent tool.
Run from any directory inside the platform checkout.
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tomllib
from pathlib import Path

ROLES = {
    "widget": "widget-agent",
    "service": "service-agent",
}


def repository_root() -> Path:
    return Path(__file__).resolve().parent.parent


def build_prompt(root: Path, role: str, task: str) -> str:
    agent_file = root / ".codex" / "agents" / f"{ROLES[role]}.toml"
    with agent_file.open("rb") as handle:
        agent = tomllib.load(handle)
    instructions = agent.get("developer_instructions")
    if not isinstance(instructions, str) or not instructions.strip():
        raise ValueError(f"Missing developer_instructions: {agent_file}")
    return (
        f"You are acting as the ReactEdge {ROLES[role]} specialist.\n"
        "The following are repository-maintained role instructions. "
        "Apply them alongside all higher-priority Codex instructions.\n\n"
        f"{instructions.strip()}\n\n"
        "User task:\n"
        f"{task.strip()}\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("role", choices=sorted(ROLES))
    parser.add_argument("task", nargs="+", help="Task for the selected specialist")
    parser.add_argument("--dry-run", action="store_true", help="Print the invocation without running Codex")
    args = parser.parse_args()

    root = repository_root()
    if not (root / "AGENTS.md").is_file():
        parser.error("Cannot find ReactEdge platform AGENTS.md")
    prompt = build_prompt(root, args.role, " ".join(args.task))
    command = ["codex", "exec", "-C", str(root), "-"]

    if args.dry_run:
        print("Command:", " ".join(command))
        print("Role:", ROLES[args.role])
        print("Working directory:", root)
        print("Prompt:\n" + prompt)
        return 0

    if shutil.which("codex") is None:
        print("Codex CLI not found on PATH. Install/configure Codex CLI first.", file=sys.stderr)
        return 127

    print(f"Launching {ROLES[args.role]} via Codex CLI...", flush=True)
    try:
        return subprocess.run(command, input=prompt, text=True, cwd=root, check=False).returncode
    except KeyboardInterrupt:
        return 130
    except OSError as exc:
        print(f"Unable to launch Codex: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

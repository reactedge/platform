#!/usr/bin/env python3
"""Launch a ReactEdge specialist in a separate Codex CLI process.

This is not Codex's native sub-agent delegation API.
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tomllib
from pathlib import Path

ROLES = {"widget": "widget-agent", "service": "service-agent"}


def repository_root() -> Path:
    return Path(__file__).resolve().parent.parent


def role_instructions(root: Path, role: str) -> str:
    path = root / ".codex" / "agents" / f"{ROLES[role]}.toml"
    with path.open("rb") as stream:
        instructions = tomllib.load(stream).get("developer_instructions")
    if not isinstance(instructions, str) or not instructions.strip():
        raise ValueError(f"Missing developer_instructions in {path}")
    return instructions.strip()


def build_prompt(root: Path, role: str, task: str) -> str:
    return (
        f"Act as the ReactEdge {ROLES[role]} specialist.\n"
        "Follow repository instructions and engineering standards.\n\n"
        f"{role_instructions(root, role)}\n\n"
        f"User task:\n{task.strip()}\n"
    )


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("role", choices=sorted(ROLES))
    parser.add_argument("task", nargs="+", help="Task for the selected specialist")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def launch(command: list[str], prompt: str, root: Path) -> int:
    if shutil.which("codex") is None:
        print("Codex CLI not found on PATH.", file=sys.stderr)
        return 127
    try:
        return subprocess.run(command, input=prompt, text=True, cwd=root, check=False).returncode
    except KeyboardInterrupt:
        return 130
    except OSError as error:
        print(f"Unable to launch Codex: {error}", file=sys.stderr)
        return 1


def main() -> int:
    args = parse_arguments()
    root = repository_root()
    if not (root / "AGENTS.md").is_file():
        print("ReactEdge AGENTS.md not found.", file=sys.stderr)
        return 2
    try:
        prompt = build_prompt(root, args.role, " ".join(args.task))
    except (OSError, ValueError, tomllib.TOMLDecodeError) as error:
        print(f"Invalid agent definition: {error}", file=sys.stderr)
        return 2
    command = ["codex", "exec", "-C", str(root), "-"]
    if args.dry_run:
        print(f"Command: {' '.join(command)}\nPrompt:\n{prompt}")
        return 0
    return launch(command, prompt, root)


if __name__ == "__main__":
    raise SystemExit(main())

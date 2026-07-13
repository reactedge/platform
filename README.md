# Welcome to ReactEdge

## 1. Clone the repository

```bash
git clone https://github.com/reactedge/ready ReactEdge
cd ReactEdge
```

## 2. Install mise

```bash
curl https://mise.run | sh
```

Activate it (Bash):

```bash
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
```

Verify:

```bash
mise --version
```

## 3. Install the ReactEdge toolchain

```bash
mise install
```

This installs the required Node.js and Python versions.

## 4. Install all project dependencies

```bash
chmod u+x ./launcher/scripts/*.sh
```

```bash
mise run platform-install
```

This installs the dependencies for all ReactEdge projects and widgets.

## 5. Launch a widget

```bash
mise run widget-dev -- usp
```

or

```bash
mise run widget-dev -- banner
```
#!/usr/bin/env python3
"""
Validate that the development environment is set up correctly.
Run after setup.sh to catch issues before dev.sh.
"""

import subprocess
import sys
from pathlib import Path


def check_python_version():
    """Verify venv Python is compatible."""
    try:
        result = subprocess.run(
            ["./backend/venv/bin/python", "--version"],
            capture_output=True,
            text=True,
            check=True,
        )
        version = result.stdout.split()[1]
        major, minor = map(int, version.split(".")[:2])

        if (major, minor) not in [(3, 10), (3, 11), (3, 12)]:
            print(f"❌ Virtual environment uses Python {version} (need 3.10-3.12)")
            return False
        print(f"✅ Python {version} in virtual environment")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Virtual environment not found or not working")
        print("   Run: ./setup.sh")
        return False


def check_env_files():
    """Verify all .env files exist."""
    files = ["backend/.env", "web/.env"]
    all_exist = True
    for f in files:
        if Path(f).exists():
            print(f"✅ {f} exists")
        else:
            print(f"❌ {f} missing")
            print(f"   Run: ./setup.sh or copy {f}.example to {f}")
            all_exist = False
    return all_exist


def check_dependencies():
    """Verify key dependencies are installed."""
    checks = [
        (["./backend/venv/bin/python", "-c", "import fastapi"], "FastAPI"),
        (["./backend/venv/bin/python", "-c", "import pydantic"], "Pydantic"),
        (["./backend/venv/bin/python", "-c", "import firebase_admin"], "Firebase Admin"),
    ]

    all_ok = True
    for cmd, name in checks:
        try:
            subprocess.run(cmd, capture_output=True, check=True, timeout=5)
            print(f"✅ {name} installed")
        except subprocess.CalledProcessError:
            print(f"❌ {name} not installed")
            print(f"   Run: cd backend && source venv/bin/activate && pip install -r requirements.txt")
            all_ok = False
        except subprocess.TimeoutExpired:
            print(f"⚠️  {name} check timed out")
            all_ok = False
    return all_ok


def check_node_dependencies():
    """Check if Node.js dependencies are installed."""
    if Path("web/node_modules").exists():
        print("✅ Web dependencies installed")
        return True
    else:
        print("❌ Web dependencies not installed")
        print("   Run: cd web && npm install")
        return False


def check_ports():
    """Check if required ports are available."""
    import socket

    ports = {8000: "Backend", 3000: "Web", 4000: "Firebase"}
    all_free = True

    for port, service in ports.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(("localhost", port))
        sock.close()

        if result == 0:
            print(f"⚠️  Port {port} ({service}) is already in use")
            print(f"   Stop the service or run: lsof -ti:{port} | xargs kill -9")
            all_free = False
        else:
            print(f"✅ Port {port} ({service}) is available")

    return all_free


if __name__ == "__main__":
    print("🔍 Validating development environment setup...")
    print("")

    checks = [
        ("Python Version", check_python_version),
        ("Environment Files", check_env_files),
        ("Python Dependencies", check_dependencies),
        ("Node Dependencies", check_node_dependencies),
        ("Ports", check_ports),
    ]

    results = []
    for name, check_func in checks:
        print(f"--- {name} ---")
        results.append(check_func())
        print("")

    print("=" * 60)
    if all(results):
        print("✅ All checks passed! Ready to run ./dev.sh")
        sys.exit(0)
    else:
        print("❌ Some checks failed. Please fix issues before running ./dev.sh")
        print("")
        print("Need help? Check TROUBLESHOOTING.md or run ./setup.sh again")
        sys.exit(1)

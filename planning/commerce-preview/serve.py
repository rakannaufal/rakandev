"""Serve the design preview and its public assets on loopback only."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
PREVIEW = ROOT / "planning/commerce-preview/index.html"
PUBLIC_ROOTS = (ROOT / "site/public/assets", ROOT / "brand/fonts", ROOT / "brand/logos")


class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        request_path = unquote(urlsplit(self.path).path)
        if request_path in ("/", "/planning/commerce-preview/", "/planning/commerce-preview/index.html"):
            target = PREVIEW
        else:
            target = (ROOT / request_path.lstrip("/")).resolve()
            if not any(target.is_relative_to(root) for root in PUBLIC_ROOTS):
                self.send_error(404)
                return
        if not target.is_file():
            self.send_error(404)
            return
        content = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", self.guess_type(str(target)))
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    print("Preview: http://127.0.0.1:4371/planning/commerce-preview/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 4371), PreviewHandler).serve_forever()

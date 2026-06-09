#!/usr/bin/env python3
"""Servidor de desarrollo sencillo SIN caché.

Sirve los archivos del proyecto en http://localhost:4321 igual que
`python3 -m http.server`, pero añadiendo cabeceras que le dicen al navegador
"no guardes copias". Así, cada vez que recargas la página ves SIEMPRE la
última versión de tus archivos, sin tener que hacer recarga a fondo.

Uso: python3 scripts/devserver.py
"""
import http.server
import socketserver
import os

PORT = 4321
# Servimos desde la raíz del proyecto (la carpeta que contiene este /scripts).
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # Le pedimos al navegador que no reutilice copias guardadas.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Servidor de desarrollo (sin cache) en http://localhost:{PORT}")
        httpd.serve_forever()

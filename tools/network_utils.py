import socket
import time
import requests
from typing import List, Optional

def resolve_host(host: str, timeout: float = 2.0) -> Optional[str]:
    """Try to resolve a hostname to an IP address. Returns IP string or None."""
    try:
        # getaddrinfo returns list of (family, type, proto, canonname, sockaddr)
        infos = socket.getaddrinfo(host, None)
        if not infos:
            return None
        # sockaddr may be (address, port) or (address,)
        addr = infos[0][4][0]
        return addr
    except Exception:
        return None


def download_with_retries(url: str,
                          dest_path: str,
                          fallback_hosts: List[str] = None,
                          host_override: Optional[str] = None,
                          max_retries: int = 3,
                          backoff_factor: float = 0.5,
                          timeout: float = 10.0) -> bool:
    """Download a URL to dest_path with retries and optional fallback hosts.

    - If host_override is set, it will be used as the Host header.
    - fallback_hosts should be full base URLs (e.g. https://1.2.3.4)
    Returns True on success.
    """
    session = requests.Session()
    urls_to_try = [url]
    if fallback_hosts:
        for fh in fallback_hosts:
            # attempt to map the original path onto fallback base
            try:
                path = url.split('://', 1)[1]
                # remove host portion
                path = '/' + '/'.join(path.split('/')[1:])
            except Exception:
                path = ''
            urls_to_try.append(fh.rstrip('/') + path)

    last_exc = None
    for attempt in range(1, max_retries + 1):
        for candidate in urls_to_try:
            headers = {}
            if host_override:
                headers['Host'] = host_override
            try:
                r = session.get(candidate, headers=headers, timeout=timeout, stream=True)
                if r.status_code == 200:
                    with open(dest_path, 'wb') as fh:
                        for chunk in r.iter_content(8192):
                            if chunk:
                                fh.write(chunk)
                    return True
                else:
                    last_exc = Exception(f"HTTP {r.status_code} for {candidate}")
            except Exception as e:
                last_exc = e
        # exponential backoff
        time.sleep(backoff_factor * (2 ** (attempt - 1)))

    # final failure
    return False

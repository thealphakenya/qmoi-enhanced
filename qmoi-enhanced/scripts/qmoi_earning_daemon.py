import time
import threading
from qmoi_earning_enhanced import QmoiEarning, MASTER_EMAIL, MASTER_PHONE


# Simulate master authorization (in production, check real credentials)
def is_master():
    return True


def earning_loop(q: QmoiEarning):
    while True:
        q.earn(10)  # Earn 10 units every cycle
        time.sleep(10)  # Every 10 seconds
        # Periodically deposit if enough earnings and master authorized
        if q.earnings >= 100:
            if is_master():
                q.deposit("Airtel Money", 100, by_master=True)
        q.show_audit_log()
        print("---")


def main():
    q = QmoiEarning()
    q.link_account("Airtel Money")
    q.link_account("Mpesa")
    t = threading.Thread(target=earning_loop, args=(q,), daemon=True)
    t.start()
    print("QMOI Earning Daemon started. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        print("QMOI Earning Daemon stopped.")


if __name__ == "__main__":
    main()

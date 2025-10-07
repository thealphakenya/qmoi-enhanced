MASTER_EMAIL = "rovicviccy@gmail.com"
MASTER_PHONE = "+254786322855"

class QmoiEarning:
    def __init__(self):
        self.earnings = 0
        self.audit_log = []
        self.linked_accounts = {"Airtel Money": False, "Mpesa": False}

    def link_account(self, service):
        if service in self.linked_accounts:
            self.linked_accounts[service] = True
            self.audit_log.append(f"Linked {service} to {MASTER_EMAIL}/{MASTER_PHONE}")
            print(f"{service} linked to master.")
        else:
            print(f"Unknown service: {service}")

    def earn(self, amount):
        self.earnings += amount
        self.audit_log.append(f"Earned {amount}")
        print(f"Earned {amount}. Total: {self.earnings}")

    def deposit(self, service, amount, by_master):
        if not by_master:
            print("Only master can authorize outgoing transactions.")
            return
        if not self.linked_accounts.get(service, False):
            print(f"{service} not linked.")
            return
        self.earnings -= amount
        self.audit_log.append(f"Deposited {amount} to {service}")
        print(f"Deposited {amount} to {service}. Remaining: {self.earnings}")

    def show_audit_log(self):
        print("Audit Log:")
        for entry in self.audit_log:
            print(entry)

if __name__ == "__main__":
    q = QmoiEarning()
    q.link_account("Airtel Money")
    q.link_account("Mpesa")
    q.earn(1000)
    q.deposit("Airtel Money", 500, by_master=True)
    q.show_audit_log() 
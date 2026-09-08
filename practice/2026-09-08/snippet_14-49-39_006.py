# Practice commit 6
# Topic: practiced greedy algorithm thinking

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)

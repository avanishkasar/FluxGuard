# Practice commit 22
# Topic: revised loop logic: for vs while differences

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)

# Practice commit 18
# Topic: studied in-place vs extra space solutions

n = 12345
rev = 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)

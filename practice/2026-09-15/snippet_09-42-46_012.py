# Practice commit 12
# Topic: reviewed nested loops and multiplication table

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)

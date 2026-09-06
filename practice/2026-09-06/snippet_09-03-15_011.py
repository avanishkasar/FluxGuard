# Practice commit 11
# Topic: practiced two sum using hash map approach

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)

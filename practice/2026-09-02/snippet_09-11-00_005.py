# Practice commit 5
# Topic: practiced digit extraction: n % 10 gives last digit

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)

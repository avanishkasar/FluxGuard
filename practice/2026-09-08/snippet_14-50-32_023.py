# Practice commit 23
# Topic: went over list vs set: when to use which

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)

# Practice commit 20
# Topic: revised recursion: base case and recursive case

n = 1234
result = 0
while n > 0:
    result += n % 10
    n //= 10
print(result)

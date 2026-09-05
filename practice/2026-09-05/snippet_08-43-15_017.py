# Practice commit 17
# Topic: practiced digit extraction: n % 10 gives last digit

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)

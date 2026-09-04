# Practice commit 1
# Topic: went over list vs set: when to use which

a, b = 0, 1
for _ in range(10):
    print(a, end=' ')
    a, b = b, a + b

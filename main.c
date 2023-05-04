#include "ctype.h"
#include "stdio.h"

typedef struct
{
    unsigned char arr[2][10];
} Data_TypeDef;

Data_TypeDef mData = {0};

int main()
{
    unsigned char a[2] = "12";
    unsigned char b;
    mData.arr[0][0] = 1;

    printf("%d\n", mData.arr[0][0]);

    return 0;
}
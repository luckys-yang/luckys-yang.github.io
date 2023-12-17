---
title: STM32程序问题集合
cover: /img/num152.webp
categories:
  - 问题
comments: false
abbrlink: bbeab65f
date: 2023-09-16 17:34:01
---



## HAL库

> 软件复位的话，最好在复位前关闭所有中断，然后再复位
>
> ```cpp
> __disable_fault_irq();	// 关闭所有中断
> HAL_NVIC_SystemReset();	// 复位
> ```

> 使用了DMA后，uart的global中断要勾选的，不然，就会产生只能发送一次的问题，理论上讲有一个数据流中断就可以了因为发送和接收各自有自己的数据流中断(程序里不需要处理dma中断函数默认即可)
>
> 还要检查DMA的初始化是不是在串口初始化的上面
>
> 一般情况uart dma发送选择 `normal` 模式（只作用一次），接收采用 `circular` 模式（连接作用）
>
> circular模式的 xxxCpltCallback回调才有用，normal模式不使用回调
>
> 如果不勾中断的话就需要：
>
> 在调用HAL_UART_Transmit_DMA前，将
>
> ```cpp
> huartx.gState = HAL_UART_STATE_READY;
> ```

> 参考文章：[STM32CubeMX HAL库和串口屏通信卡死问题解决](https://blog.csdn.net/hpy518/article/details/130105031)
>
> 空闲中断串口通信卡死问题，而且尽量不要在中断里面进行打印操作也会卡死
>
> 在接收数据那接收了一次后就没反应了，解决方法是添加串口错误中断
>
> ```cpp
> __HAL_UART_ENABLE_IT(&BT_UART, UART_IT_IDLE);	//开启串口空闲中断
> __HAL_UART_ENABLE_IT(&huart2, UART_IT_ERR);//使能串口错误中断
> HAL_UARTEx_ReceiveToIdle_IT(&BT_UART, (uint8_t *)MyHC05.BT_NewData, BT_Rec_MAX_LEN);
> ```
>
> 然后添加中断错误回调函数
>
> ```cpp
> void HAL_UART_ErrorCallback(UART_HandleTypeDef *huart)	
> {
> 	if(huart->Instance==USART2)
> 	{
> 		if(__HAL_UART_GET_FLAG(huart,UART_FLAG_ORE) != RESET)
> 		{
> 			__HAL_UART_CLEAR_OREFLAG(huart);
> 		}
> 		__HAL_UNLOCK(&huart2);
> 		HAL_UARTEx_ReceiveToIdle_IT(&BT_UART, (uint8_t*)MyHC05.BT_NewData,BT_Rec_MAX_LEN);
> 	}
> }
> ```
>
> 空闲中断回调函数里面正常就行
>
> ```cpp
> void HAL_UARTEx_RxEventCallback(UART_HandleTypeDef *huart, uint16_t Size)
> {
> 	if (huart->Instance == huart2.Instance)
> 	{
> 		protocol_data_recv(MyHC05.BT_NewData, Size);//将数据放入到环形缓冲区
> 		HAL_UARTEx_ReceiveToIdle_IT(&BT_UART, (uint8_t*)&MyHC05.BT_NewData,BT_Rec_MAX_LEN);
> 	}
> }
> ```

> 参考文章：[STM32G系列 HAL串口DMA接收](https://blog.csdn.net/qinxin4/article/details/121271375?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522170196063216800182174388%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=170196063216800182174388&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-2-121271375-null-null.142^v96^control&utm_term=hal%20%E4%B8%B2%E5%8F%A3%E4%B8%8A%E6%8B%89&spm=1018.2226.3001.4187)
>
> 在进行4GCat模块与STM32进行串口通信时出现发送数据接收有问题，最终发现是MX默认把串口发送和接收引脚设置为浮空状态，一般我们是需要上拉的，要么就是设置PCB时外接上拉电阻，最终解决问题

## Keil

> 使用V6的话，代码含中文的话会报警告
>
> ![](https://image-1309791158.cos.ap-guangzhou.myqcloud.com/其他/QQ截图20231028210140.webp)
>
> 则需要在魔术棒那进行添加：
>
> ```cpp
> -Wno-invalid-source-encoding
> ```


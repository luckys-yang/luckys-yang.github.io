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


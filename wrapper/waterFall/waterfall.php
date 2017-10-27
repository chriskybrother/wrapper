<?php
	header("Content-type:text/html;charset=utf-8");
	// 读取data.json文件
	$data=file_get_contents("info/data.json");
	//转化
	$arrData=json_decode($data);
	//var_dump($arrData);
	//array_rand(array,num) 函数
	//从数组中随机取出一个或多个元素，并返回对应的下标；
	//从中取10个
	$newNum=array_rand($arrData,10);
	//print_r($newNum) ;
	//根据获取的随机下标，从总数组中获取下标对应的对象  生成一个新的数组；
	//array_push(array,value);
	$newArr=array();
	for($i=0;$i<count($newNum);$i++){
		//获取随机下标对应总数组的值
		$randObj=$arrData[$newNum[$i]];
		//把值push到新数组中
		array_push($newArr,$randObj);
	}
	//把$newArr包装成关联数组 给他添加一个key
	$temp=array("key"=>$newArr);
	//var_dump($temp);
	//输出
	echo json_encode($temp);
?>













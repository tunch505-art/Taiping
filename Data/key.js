


document.addEventListener('keydown', function(event) {
if(Level!==4){
 if(playing==1){  

  const key = event.key; // 押されたキーの文字
  // const code = event.code; // 物理キーコード
  // const keyCode = event.keyCode; // deprecated



   s=document.getElementById('label1').value;
   //let str="";
       //alert("Key="+key+" leter="+s.slice(posit-1,posit));

   //①入力キー（１文字）が正しいとき→Yes
   if(key==s.slice(posit-1,posit))
   {
	let name1=document.getElementById('label1');
	let name2=document.getElementById('label2');
	name2.value=name2.value+key;
	keyPast=key;
	selectText(0,posit);
	posit+=1;
	//posit2+=1;
	cntRight+=1;
	textBox2.value='正解：'+cntRight+'/'+cntAllLetters;
	let str='';
	let nn=0;
	
	if(Level==1)	//直前のキーを消す
	{

	}
	else if(Level==2 || Level==3)	//該当の的をアニメーション（文字は消す）
	{


	}
	else{		}


	//②行末に来ている時
	if(posit>name1.value.length)
	{ 
		    //alert(name1.value.length+"文字行末です！");

		if(Level==1)
		  {
			n=Data1.split('\n').length;
			dat=Data1;
		  }
		else if(Level==2)
		  {
			n=Data2.split('\n').length;
			dat=Data2;
			
			//行末のアニメーション
			tmpSS=tmpSS+key;

			if(CanShowAnime()==1)
			{
				PlayAnime(posit2);
			}

		  }
		else if(Level==3)
		  {
			n=Data3.split('\n').length;
			dat=Data3;

			//行末のアニメーション
			tmpSS=tmpSS+key;

			if(CanShowAnime()==1)
			{
				PlayAnime(posit2);
			}

		  }
		else if(Level==4)
		  {		}
		else {		}

		playSound('pinpon.wav');

		//変数の初期化
		posit=1;
		posit2=1;
		cntLnNow+=1;
		selectText(0,0);
		keyPast="";
		//dat="";
		tmpSS='';

	   setTimeout(() =>		//Level2,3で、これがないと、最後の立て看板のアニメの前に次の行の表示になる
	   {
		//③最終行でない時
		if(cntLnNow<=n)
		{

			switch (Level) {
      			   case 1:
				    //alert("まだ最終行ではありません！");
				//次の行の文字列を取得
				//Level1データの1行目の3項目目を取得
				gotData=getDATAfromCSV(dat,cntLnNow-1,2);

				//テキストボックスのid="label1"に上記データを表示する
				name1.value=gotData;

				//テキストボックスのid="label2"のデータを消去する
				name2.value="";

        			break;
      		   	   case 2:
      		   	   case 3:
				//Level2データのcntLnNow-1行目の3項目目以降を取得
				geTextbox1Data(Level);

				//テキストボックスのid="label1"に上記データを表示する
				document.getElementById('label1').value=gotData;

				//テキストボックスのid="label2"のデータを消去する
				document.getElementById('label2').value="";

				//テキストボックスに全角文字列を表示する
				document.getElementById('label3').value=getDATAfromCSV(dat,cntLnNow-1,0);

        			break;
      		   	   default:
        		
    			}
			//現在の行を表示
			document.getElementById('label4').value=cntLnNow+"/"+cntLines;	

			//次の行の文字または的の表示			
			if(Level==1)
			{
				//直前のキー（複数）を消す
				ctx0.drawImage(imageDumy, 100, 190, 800, 330, 100, 190, 800, 330);
				//次のキーをオレンジ表示
				str=Data1.split("\n");		//Data1,2,3を改行する
				datCommaTxt=str[cntLnNow-1].split(",");   //現在の1行のコンマテキスト→showPartsで使用する

				ShowParts();		//該当する行・列を表示する
				//ShowTheKey(key);	//該当するキーを表示するだが、これがない方が正しい表示になる→なぜ？			
			}
			else if(Level==2 )
			{
				//テキスト（複数）に配列キー配列[2]番目以降
				str=Data2.split("\n");		//Data1,2,3を改行する
				datCommaTxt=str[cntLnNow-1].split(",");   //現在の1行のコンマテキスト→showPartsで使用する

				n=datCommaTxt.length-2;

				//次の行の立て看板を表示するため、一旦、立て看板の文字を消す
				enabelLabels(0,9);
				//立て看板の文字を表示
				enabelLabels(1,n-1);

			}
			else if(Level==3)
			{
				//テキスト（複数）に配列キー配列[2]番目以降
				str=Data3.split("\n");		//Data1,2,3を改行する
				datCommaTxt=str[cntLnNow-1].split(",");   //現在の1行のコンマテキスト→showPartsで使用する

				n=datCommaTxt.length-2;

				//次の行の立て看板を表示するため、一旦、立て看板の文字を消す
				enabelLabels(0,9);
				//立て看板と文字を表示
				enabelLabels(1,n-1);

			}
			else {		}

		}
		//③最終行の時
		else
		{
			//最終行末のアニメーション
			tmpSS=tmpSS+key;

			if(CanShowAnime()==1)
			{
				PlayAnime(posit2);
			}

			tmpSS='';
			   //alert("最終行です！");

			//'Good Job!'を表示
			document.getElementById('label5').style.display='block';
			playSound('kansei.wav');

			//タイマー停止→stopボタンOnで処理
			//clearInterval(timerInterval);
			stopClick();

		}

	   }, 400); // 0.4秒後に実行

	}
	//②行末でないとき
	else
	{
		if(Level==1)	//次のキーをオレンジ色表示
		{
			ShowTheKey(key);
		}
		else if(Level==2 || Level==3)
		{
			tmpSS=tmpSS+key;

			if(CanShowAnime()==1)
			{
				playSound('arrow.wav');
				PlayAnime(posit2);
				posit2+=1;
			}
		}
		else{		}
	}
   }
   
   //①入力キーが間違っているとき
   else 
   {
	cntWrong+=1;
	textBox3.value='ミス：'+cntWrong;
	playSound('bu.wav');


   }



 }
}
});







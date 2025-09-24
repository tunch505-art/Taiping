function RdoBtn1()
{
	//alert("ラジオボタン１が押されました！");
	Level=1;
	cntLnNow=1;
	posit=1;
	posit2=1;
	tmpSS='';

	showInitial();
}

function RdoBtn2()
{
	//alert("ラジオボタン２が押されました！");

	Level=2;
	cntLnNow=1;
	posit=1;
	posit2=1;
	tmpSS='';

	showInitial();
}

function RdoBtn3()
{
	//alert("ラジオボタン３が押されました！");

	Level=3;
	cntLnNow=1;
	posit=1;
	posit2=1;
	tmpSS='';

	showInitial();
}

function RdoBtn4()
{
	//alert("上級編は現在作成中です！");


	Level=4;

	showInitial();
}


function stopClick()
{
   if(Level!=4)
   {
	//alert("停止ボタンが押されました！");
	playing=0;
	stpBtn=1;

	//タイマー停止
	clearInterval(timerInterval);

	//let btn1=getElementById('btnStart');  //すでにIndex.htmlで宣言済み
	//let btn2=getElementById('btnStop');
	btn1.disabled=false;	//Startボタン有効
	btn2.disabled=true;	//stopボタン無効
	fld1.disabled=false;
   }
   else
   {
	btn1.disabled=false;	//Startボタン有効
	//btn2.disabled=true;	//Stopボタン無効
	btn3.disabled=true;	//Kanseiボタン無効

	stpBtn=1;
	clearInterval(timerInterval2);	

   }

}


function startClick()
{
   	//alert("スタートボタンが押されました！");
	
	cntLnNow=1;
	posit=1;
	posit2=1;
	tmpSS='';

   if(Level!=4)
   {
	if(stpBtn==1)			//画面初期化
	{	showInitial();	  }

	//経過時間のタイマー起動
	startTime = new Date();
      	timerInterval = setInterval(getTime, 100); // 100ミリ秒ごとに更新

	playing=1; 
	stpBtn=0;
	cntRight=0;
	cntWrong=0;

	//ボタンの有効無効
	btn1.disabled=true;	//Startボタン無効
	btn2.disabled=false;	//Stopボタン有効
	fld1.disabled=true;

	//'Good Job!'を消す 
	document.getElementById('label5').style.display='none';
   }
   else
   {
	if(document.getElementById('TxtReadOnly').innerHTML=='')
	{
		alert("先に「問題を開く」ボタンを押し、問題を選んでください！");
		return;
	}

	if(stpBtn==1)
	{
		let txt=document.getElementById('TxtReadOnly').textContent;

		document.getElementById('TxtReadOnly').innerHTML='';
		document.getElementById('TxtReadOnly').innerHTML=txt;
		document.getElementById('TxtInput').innerHTML='';
	}

	stpBtn=0;
	btn1.disabled=true;	//Startボタン無効
	//btn2.disabled=false;	//Stopボタン有効
	btn3.disabled=false;	//Kanseiボタン有効
	fld1.disabled=true;

	txt2.value="正解：";
	txt3.value="ミス：";

	//TxtInputの入力を可にする
	document.getElementById('TxtInput').contentEditable='true';

	startTime = new Date();
	totalTimes=limitedTime*60*1000;
	   //alert(limitedTime);
	timerInterval2 = setInterval(getTime, 100);

   }

}

function kanseiClick()
{
   if(Level==4)
   {
	   //alert("完成ボタンが押されました！");
	clearInterval(timerInterval2);

	let text1 =document.getElementById('TxtReadOnly').innerHTML;
	let text2 =document.getElementById('TxtInput').innerHTML;

	let result = getDiff(text1, text2);
	
	//alert("正解＝"+cntRight/cntMondai+"%"+"　ミス＝"+cntWrong);
	txt2.value="正解："+Math.round(cntRight*100/cntMondai)+"点";
	txt3.value="ミス："+cntWrong+"ヶ所";
	
	btn1.disabled=false;	//Startボタン有効
	//btn2.disabled=true;	//stopボタン無効
	btn3.disabled=true;	//Kanseiボタン無効
	fld1.disabled=false;

	stpBtn=1;		//ダミーとして入れておく

	document.getElementById('TxtReadOnly').innerHTML =result.html1;
	document.getElementById('TxtInput').innerHTML = result.html2;
	//TxtInputの入力を不可にする
	document.getElementById('TxtInput').contentEditable='false';

   }

}


//ボタン「問題を開く」
function openClick()
{
	cntMondai=0;
	//alert("open");
	document.getElementById('fileInput').click();
	document.getElementById('fileInput').addEventListener('change',
	function(event) {
  	const file = event.target.files[0]; // 選択されたファイルを取得
  	const reader = new FileReader(); // FileReaderオブジェクトを作成

  	// ファイルを読み込む
  	reader.onload = function(e) {
    	const text = e.target.result; // 読み込んだファイルの内容を取得

	let [result1,result2]=getSecondLineAndAfter(text);
	cntMondai=result2.length;
	   //alert(cntMondai);

	limitedTime=getLimitedTime(result1);			//１行目から制限時間を得る
	   //alert(limitedTime);

    	document.getElementById('TxtReadOnly').innerHTML = result2; 	//２行目以降をtextareaに表示
	document.getElementById('TxtInput').innerHTML='';		//TxtInputエリア内を消す

	document.getElementById('TxtScale').value=limitedTime+'分';	//Scaleバーに残時間表示
	document.getElementById('label4').value=getTitle(result1);	//左上に問題タイトル表示
	TxtScale.style.width='680px';

	txt1.value="時間：";
	txt2.value="正解：";
	txt3.value="ミス：";


  	};

  	reader.readAsText(file); // テキストファイルとしてファイルを読み込む

	});


}

//Level4で、1,2行目以降の内容を得る
function getSecondLineAndAfter(text)
{
	let lines=text.split("\n");
	let firstLine=lines[0];					//1行目→lines(0)はうまくいかない？
	let secondLineAndAfter=lines.slice(1).join("\n");	//2行目→lines.slice(1)はうまくいく？
	
	return [firstLine,secondLineAndAfter];

}

//Level4で、問題タイトルを得る
function getTitle(text)
{
	let s1='時間';
	let Index=text.indexOf(s1);

	return text.slice(0,Index);
}

//Level4で、制限時間を得る
function getLimitedTime(text)
{
	let s1='時間';
	let s2='分';
	let startIndex=text.indexOf(s1)+s1.length;
	let endIndex=text.indexOf(s2);

	return Number(text.slice(startIndex,endIndex));
}

//ボタン「記録する」
function recordClick()
{
	alert("record");

}


function getDATAfromCSV(data,x,y)
{
	const dataArray=data.trim().split('\n').map(row=>row.split(','));
	

	return dataArray[x][y];

}

function clearPlaceholder(element)
{
	if(element.value==="上の文章をここに入力してください")
	{
		element.value="";
	}

}

function restorePlaceholder(element)
{
	if(element.value==="")
	{
		element.value="上の文章をここに入力してください";
	}
	

}

function getLetters(data)
{
	let dat="";
	let str="";
	let str2="";
	let str3="";
	let gyou=0;
	let ln=0;
	let letters=0;

	str=data.split("\n");		//Data1,2,3を改行する
	gyou=str.length;

	datCommaTxt=str[cntLnNow-1].split(",");   //現在の1行のコンマテキスト→showPartsで使用する

	for(i=cntLnNow-1;i<gyou;i++)
	{

		str2=str[i].split(",");//各行をコンマ[,]で区切る
		//ln=str2.length;			//その行の配列要素の数(Length)を得る

		if(Level==1)
		{
			ln=str2[2].length;
			letters=letters+ln;
		}
		else if(Level==2 || Level==3)
		{
			str3="";		//これがないと、文字列の総数がそのたびプラスカウントされる
			ln=str2.length;
			for(j=2;j<ln;j++)
			{
				str3=str3+str2[j];
			}
			letters=letters+str3.length;

		}
		else{     }
			
	}
	cntLines=i;	//行数を取得
	
	return letters;
}



function geTextbox1Data(LevelN)
{
	let dat="";
	let str="";
	let str2="";
	let str3="";
	let ln=0;

	if(LevelN==2){dat=Data2}
	else if(LevelN==3){dat=Data3}
	else{        };
	
	str=dat.split("\n");		//Data2,3を改行する
	str2=str[cntLnNow-1].split(",");//各行をコンマ[,]で区切る
	ln=str2.length;			//その行の配列要素の数(Length)を得る

	for(i=2;i<ln;i++)
	{
		str3=str3+str2[i];
	}
	
	gotData=str3;			//TextBoxに表示するデータ
	//alert(str3);


}

// 音を再生する関数
function playSound(soundFile)
{
  // 新しいAudioオブジェクトを作成
  const audio = new Audio(soundFile);

  // 再生前に音量を調整
  audio.volume = 0.5; // 例: 音量を半分に

  // 再生
  audio.play();

  // オブジェクトを配列に保存
  audioInstances.push(audio);

  // 再生終了時に配列から削除
  audio.addEventListener('ended', function() {
    const index = audioInstances.indexOf(audio);
    if (index > -1) {
      audioInstances.splice(index, 1);
    }
  });
}

//テキストボックスの既正解文字列の背景を選択
function selectText(start,end)
{
   const textbox1=document.getElementById('label1');
   textbox1.setSelectionRange(start,end);
   textbox1.focus();


}

//初期画面表示
function showInitial()
{
	let n=0;

	if(Level==1)
	{
		
		//Level1データの1行目の3項目目を取得
		gotData=getDATAfromCSV(Data1,0,2);

		//テキストボックスのid="label1"に上記データを表示する
		document.getElementById('label1').value=gotData;
		document.getElementById('label1').setSelectionRange(0,0);

		//テキストボックスのid="label2"のデータを消去する
		document.getElementById('label2').value="";

		//テキストボックスに全角文字列を消去する
		document.getElementById('label3').value="";

		//Data1の全文字数を得る
		cntAllLetters=getLetters(Data1);

		//画面に背景画像を表示
		image0.src = 'Pictures/class.jpg'; 
		drawImageOnimageBack();

		// imageDumyに画像を直接描画
		image3.src = 'Pictures/class.jpg';
		drawImageOnimageDumy();
		
		//label1,2,3を表示
		label1.style.display='block';
		label2.style.display='block';
		label3.style.display='block';

		//ボタン関係の表示
		btnStart.style.display='block';
		btnStop.style.display='block';
		btnKansei.style.display='none';

		//Level4ボタン関係を消す
		btnOpen.style.display='none';
		btnRecord.style.display='none';
		btnKansei.style.display='none';

		//fieldset3を消す
		field3.style.display='none';

		//TxtReadOnlyとTxtInputのエリアを消す
		document.getElementById('TxtReadOnly').style.display='none';
		document.getElementById('TxtInput').style.display='none';

		//現在の行を表示
		document.getElementById('label4').value=cntLnNow+"/"+cntLines;	

		//立て看板の文字を消す
		enabelLabels(0,9);

		//このようにディレーを設定しないとパーツが表示されない（なぜ？）
		setTimeout(ShowParts,20);
		//ShowParts();
	}
	else if(Level==2)
	{	
		//Level2データの1行目の3項目目を取得
		geTextbox1Data(Level);

		//テキストボックスのid="label1"に上記データを表示する
		document.getElementById('label1').value=gotData;
		document.getElementById('label1').setSelectionRange(0,0);

		//テキストボックスのid="label2"のデータを消去する
		document.getElementById('label2').value="";

		//テキストボックスに全角文字列を表示する
		document.getElementById('label3').value=getDATAfromCSV(Data2,0,0);

		//Data2の全文字数を得る
		cntAllLetters=getLetters(Data2);

		//画面に背景画像を表示
		image0.src = 'Pictures/Back2.jpg'; 
		drawImageOnimageBack();

		// imageDumyに画像を直接描画
		image3.src = 'Pictures/Back2.jpg';
		drawImageOnimageDumy();

		//label1,2,3を表示
		label1.style.display='block';
		label2.style.display='block';
		label3.style.display='block';

		//ボタン関係の表示
		btnStart.style.display='block';
		btnStop.style.display='block';
		btnKansei.style.display='none';

		//Level4ボタン関係を消す
		btnOpen.style.display='none';
		btnRecord.style.display='none';
		btnKansei.style.display='none';

		//fieldset3を消す
		field3.style.display='none';

		//TxtReadOnlyとTxtInputのエリアを消す
		document.getElementById('TxtReadOnly').style.display='none';
		document.getElementById('TxtInput').style.display='none';

		//現在の行を表示
		document.getElementById('label4').value=cntLnNow+"/"+cntLines;	

		//一旦、立て看板の文字を消す
		n=datCommaTxt.length-2;
		enabelLabels(0,9);
		//立て看板の文字を表示
		enabelLabels(1,n-1);

	}
	else if(Level==3)
	{
		//Level2データの1行目の3項目目を取得
		geTextbox1Data(Level);

		//テキストボックスのid="label1"に上記データを表示する
		document.getElementById('label1').value=gotData;
		document.getElementById('label1').setSelectionRange(0,0);

		//テキストボックスのid="label2"のデータを消去する
		document.getElementById('label2').value="";

		//テキストボックスに全角文字列を表示する
		document.getElementById('label3').value=getDATAfromCSV(Data3,0,0);

		//Data3の全文字数を得る
		cntAllLetters=getLetters(Data3);

		//画面に背景画像を表示
		image0.src = 'Pictures/Back3.jpg'; 
		drawImageOnimageBack();

		// imageDumyに画像を直接描画
		image3.src = 'Pictures/Back3.jpg';
		drawImageOnimageDumy();

		//label1,2,3を表示
		label1.style.display='block';
		label2.style.display='block';
		label3.style.display='block';

		//ボタン関係の表示
		btnStart.style.display='block';
		btnStop.style.display='block';
		btnKansei.style.display='none';

		//Level4ボタン関係を消す
		btnOpen.style.display='none';
		btnRecord.style.display='none';
		btnKansei.style.display='none';

		//fieldset3を消す
		field3.style.display='none';

		//TxtReadOnlyとTxtInputのエリアを消す
		document.getElementById('TxtReadOnly').style.display='none';
		document.getElementById('TxtInput').style.display='none';

		//現在の行を表示
		document.getElementById('label4').value=cntLnNow+"/"+cntLines;	

		//一旦、立て看板の文字を消す
		n=datCommaTxt.length-2;
		enabelLabels(0,9);
		//立て看板の文字を表示
		enabelLabels(1,n-1);

	}
	else if(Level==4)
	{
		//画面に背景画像を表示
		image0.src = 'Pictures/Back4.jpg'; 
		drawImageOnimageBack();
	
		// imageDumyに画像を直接描画→Level4ではDummyは使用しないが、これがないと、Level1からLevel4に切り替えたとき、Level1の画像の一部が残る
		image3.src = 'Pictures/Back4.jpg';
		drawImageOnimageDumy();

		//立て看板の文字を消す
		enabelLabels(0,9);

		//label1,2,3を消す
		label1.style.display='none';
		label2.style.display='none';
		label3.style.display='none';

		//Level4ボタン関係の表示
		btnStart.style.display='block';
		btnStop.style.display='none';
		btnKansei.style.display='block';

		btn1.disabled=false;	//Startボタン有効
		//btn2.disabled=true;	//Stopボタン無効
		btn3.disabled=true;	//Kanseiボタン無効

		btnOpen.style.display='block';
		btnRecord.style.display='block';
		btnKansei.style.display='block';

		//fieldset3の表示
		field3.style.display='block';
		//TxtInput.innerHTML='上の文章を入力してください。';

		//問題画面の内容、入力画面の内容、Scaleバーの時間、問題タイトルの文字を消す
		document.getElementById('TxtReadOnly').innerHTML='';
		document.getElementById('TxtInput').innerHTML='';
		document.getElementById('TxtScale').value='';
		TxtScale.style.width='680px';		
		document.getElementById('label4').value='';

		//TxtReadOnlyとTxtInputのエリアを表示
		document.getElementById('TxtReadOnly').style.display='block';
		document.getElementById('TxtInput').style.display='block';

		//TxtInputの入力を不可にする
		document.getElementById('TxtInput').contentEditable='false';

	}
	else {  }

	//停止ボタンを無効化
	btn2.disabled=true;
	//経過時間を初期化
	textBox1.value = '時間：';
	textBox2.value='正解：';
	textBox3.value='ミス：';

	//'Good Job!'を消す
	document.getElementById('label5').style.display='none';
}

//経過時間、残時間取得
function getTime()
{
      	const now = new Date();
      	const elapsedTime = new Date(now - startTime);
	const remaining=totalTimes-elapsedTime;

	if(remaining<=0 && Level==4)
	{
		clearInterval(timerInterval2);//タイマーを停止
		//終了ボタンを押したときの処理
		kanseiClick();

		return;
	}

	//経過時間処理
	const hours1=Math.floor(elapsedTime / (1000*60*60));
	const minutes1=Math.floor((elapsedTime % (1000*60*60)) / (1000*60));
	const seconds1=Math.floor((elapsedTime % (1000*60)) / 1000 );

      	let str1=String(hours1).padStart(2, '0');
      	let str2=String(minutes1).padStart(2, '0');
	let str3=String(seconds1).padStart(2, '0');
	if(str1=="00"){ str1="" };

      	const formattedTime =
        str1 + '時間：' +
        str2 + '分：' +
        str3 + '秒' ;  //+
        
	//String(milliseconds).padStart(3, '0');   //３は小数点以下の桁数
        textBox1.value = formattedTime;
	//display.textContent="ok";

	if (Level==4)
	{	
		//残時間処理
		const hours2=Math.floor(remaining / (1000*60*60));
		const minutes2=Math.floor((remaining % (1000*60*60)) / (1000*60));
		const seconds2=Math.floor((remaining % (1000*60)) / 1000 );
		let x=0;

		x=Math.floor((680*remaining)/totalTimes);
		TxtScale.style.width=x+'px';

		if(minutes2!=0)
		{	
			TxtScale.value=minutes2+'分'+seconds2+'秒';
		}
		else
		{
			TxtScale.value=seconds2+'秒';
		}
	}

}

function getDiff(text1,text2)
{

  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diffs);

  let html1 = "";
  let html2 = "";
  let txtRight="";
  cntRight=0;
  cntWrong=0;

  for (let i = 0; i < diffs.length; i++)
  {
    const [op, data] = diffs[i];

    if (op === 0)
    {
      	// 等しい部分（無色）
      	html1 += data;
      	html2 += data;
	txtRight=txtRight+data;
    }
    else if (op === -1)
    {
       // 削除部分（赤 or 変更）
       if (i + 1 < diffs.length && diffs[i+1][0] === 1)
	{
        	html1 += `<span class="change">${data}</span>`;
        }
        else
        {
        	html1 += `<span class="delete">${data}</span>`;
		cntWrong+=1;
        }
    }
    else if (op === 1)
    {
      	// 挿入部分（緑 or 変更）
      	if (i > 0 && diffs[i-1][0] === -1)
	 {
        	html2 += `<span class="change">${data}</span>`;
		cntWrong+=1;
         }
	 else
	 {
        	html2 += `<span class="insert">${data}</span>`;
		cntWrong+=1;
         }
    }
    cntRight=txtRight.length;
  }
  
  return {html1,html2};
  //document.getElementById("view1").innerHTML = html1;
  //document.getElementById("view2").innerHTML = html2;
}

/**
function highlightDifferences(text1, text2) {
    // Diff Match and Patch ライブラリの例を想定しています。
    // 実際にはライブラリをインポートするか、ご自身で差分を検出するロジックを実装してください。
    const dmp = new diff_match_patch(); // Diff Match and Patch ライブラリのインスタンス

    // 差分を計算
    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs); // 差分を整理

    let highlightedText1 = '';
    let highlightedText2 = '';
    let txtRight="";

    for (const diff of diffs) {
        const operation = diff[0]; // 追加、削除、変更
        const text = diff[1];

        if (operation === DIFF_INSERT)
	 { // 追加された部分（text2にのみ存在する）
            highlightedText2 += `<span style="background-color:#aaffaa;">${text}</span>`; // 緑色でハイライト
	    cntWrong+=1;
         }
	 else if (operation === DIFF_DELETE)
	 { // 削除された部分（text1にのみ存在する）
            highlightedText1 += `<span style="background-color:#ffaaaa;">${text}</span>`; // 赤色でハイライト
	    cntWrong+=1;
         }
	 else if (operation === DIFF_EQUAL) 
	 { // 等しい部分
            highlightedText1 += text;
            highlightedText2 += text;
	    txtRight=txtRight+text;
         }
	 else if (operation === DIFF_MODIFY)
	 { // 変更された部分（両方のハイライトを考慮）
            highlightedText1 += `<span style="background-color:#ffffaa;">${text}</span>`; // 黄色でハイライト
            highlightedText2 += `<span style="background-color:#ffffaa;">${text}</span>`; // 黄色でハイライト
	    
         }
	  cntRight=txtRight.length;  
    }
    return { highlightedText1, highlightedText2 };
}
**/


function ShowParts() {
    //alert("begin");	//これがないと一部画像が表示されない→なぜ？→時間差が必要

    let k='';		//現在の1行のコンマテキストの1番目の文字(Level1用)
    let k1='';		//現在の1行のコンマテキストの2番目の文字(Level1用)
    let xT=0;		//ターゲットのｘ座標
    let yT=0;		//ターゲットのｙ座標
    let xS=0;		//ソースｘ座標
    let yS=0;		//ソースのｙ座標
    let p=[0,0];	//TPoint

    let k0="";		//現在の文字
    let s1='!qaz';
    //let s2='1234567890';
    let s3='*';		//「\」はエラーになる
    let i=0;
    let j=0;
    let index=0;


    // 切り取った部分をimageBackに描画
    //ctx0.drawImage(imageKB, sx, sy, sWidth, sHeight, 100, 100, sWidth,sHeight);
    //alert("end");

	if(Level==1)		//該当のキーを表示
	{
		k=datCommaTxt[0];
		k1=datCommaTxt[1];
		//alert("cntLnNow="+cntLnNow+" datCommaTxt="+datCommaTxt+" k="+k+" k1="+k1);

		if(datCommaTxt[0]!="")
		{
			ShowKeyLine(k);
		}
		if(datCommaTxt[1]!="")
		{
			ShowKeyLine(k1);
		}

		//現在の文字を取得
		k0=datCommaTxt[2].slice(posit-1,posit);

		//ソースの座標を取得
		p=GetSourcePoint(k0);
		xS=p[0]; yS=p[1];
		//alert("xS="+xS+" yS="+yS);

		//ターゲットの座標は、オレンジ画像と背景画像の差
		xT=xS+90; yT=yS+250-20;

		//現在の文字をオレンジ色表示
		ctx0.drawImage(imageKBOrange, xS, yS, 68, 67, xT, yT, 68, 67);

	}
	else if(Level==2 || Level==3)	//立て看板と文字を表示
	{
		//alert(datCommaTxt[2]+datCommaTxt[3]);
		//まず行の立て看板を表示
		//テキスト（複数）に配列キー配列[2]番目以降

	}
	else {		}


}

function ShowKeyLine(k)		//Level1用のキーボード列・行を表示
{
    let xT=0;		//ターゲットのｘ座標
    let yT=0;		//ターゲットのｙ座標
    let xS=0;		//ソースｘ座標
    let yS=0;		//ソースのｙ座標
    let p=[0,0];	//TPoint

    let s1='!qaz';
    let s2='1234567890';
    let s3='*';		//「\」はエラーになる
    let i=0;
    let j=0;


    //alert(datCommaTxt[0]);
    //k=datCommaTxt[0];

    //ソースの座標を取得
    p=GetSourcePoint(k);
    xS=p[0]; yS=p[1];
    //alert("xS="+xS+" yS="+yS);

    //ターゲットの座標を取得
    p=GetTarPos(k);
    xT=p[0]; yT=p[1];
    //alert("xT="+xT+" yT="+yT);


    //列または行のキー配列[0]番目を表示
    if(s1.includes(k))
    {
		for(i=0;i<10;i++)
		{	
			ctx0.drawImage(imageKB, xS+i*70, yS, 68, 67, xT+i*70, yT, 68, 67);
		}

    }
    else if(s2.includes(k))
    {
		for(i=0;i<4;i++)
		{	
			ctx0.drawImage(imageKB, xS+i*30, yS+i*70, 68, 67, xT+i*30, yT+i*70, 68, 67);
		}

    }
    else if(s3.includes(k))
    {
		for(j=0;j<4;j++)
		{	
			k=s1[j];
			for(i=0;i<10;i++)				   
			{
				//ソースの座標を取得
				p=GetSourcePoint(k);
				xS=p[0]; yS=p[1];
				//alert("xS="+xS+" yS="+yS);

				//ターゲットの座標を取得
				p=GetTarPos(k);
				xT=p[0]; yT=p[1];
				//alert("xT="+xT+" yT="+yT);

				ctx0.drawImage(imageKB, xS+i*70, yS, 68, 67, xT+i*70, yT, 68, 67);
			}
		}

}
else {		}


}


function ShowTheKey(k)
{
    let xT=0;		//ターゲットのｘ座標
    let yT=0;		//ターゲットのｙ座標
    let xS=0;		//ソースｘ座標
    let yS=0;		//ソースのｙ座標
    let p=[0,0];	//TPoint
    let s="";

    //①直前のソースの座標を取得
    p=GetSourcePoint(k);
    xS=p[0]; yS=p[1];
    	//alert("xS="+xS+" yS="+yS);
    //ターゲットの座標は、オレンジ画像と背景画像の差
    xT=xS+90; yT=yS+250-20;
    	//alert("xT="+xT+" yT="+yT);
    //直前のキーを消す
    ctx0.drawImage(imageKB, xS, yS, 68, 67, xT, yT, 68, 67);

    //②次のキーのソースの座標を取得
    s=gotData.slice(posit-1,posit);
	//alert(s);
    p=GetSourcePoint(s);
    xS=p[0]; yS=p[1];
    	//alert("xS="+xS+" yS="+yS);
    //ターゲットの座標は、オレンジ画像と背景画像の差
    xT=xS+90; yT=yS+250-20;
    	//alert("xT="+xT+" yT="+yT);
    //オレンジのキーを表示
    ctx0.drawImage(imageKBOrange, xS, yS, 68, 67, xT, yT, 68, 67);

}

function CanShowAnime()		//Level2,3で、行の配列[2]以降の各コンマテキスト（複数）で、文字末に来ていればアニメーション可能
{

	let ss='';		

	ss=datCommaTxt[posit2-1+2];	//[posit2-1番目の文字]

	   //alert("テンプ文字="+tmpSS+" [posit2番目]の文字="+ss);

	if(tmpSS==ss)
	{
		tmpSS='';	
		return 1;
	}
	else{	return 0;	}

}

//立て看板のアニメーション
function PlayAnime(k)
{
    	let xT=0;		//ターゲットのｘ座標
    	let yT=0;		//ターゲットのｙ座標
    	let p=[0,0];		//TPoint
	let i=0;
	let nn=0;

	//まず、文字を消す
	nn=10+posit2-1;
	let TextMato=document.getElementById('label'+nn);
	TextMato.style.display='none';

    	//ターゲットの座標を取得
    	p=GetTarPos(k);
    	xT=p[0]; yT=p[1];
    	　　　//alert("xT="+xT+" yT="+yT);

	//アニメーションするために、タイマーを使用する
	const intervalId = setInterval(function()
	 {
		ctx0.drawImage(imageDumy, xT, yT, 80, 115, xT, yT, 80, 115);
		ctx0.drawImage(imageMato, 80*(i-1), 0, 80, 115, xT, yT, 80, 115);

		if (i === 8)
		{
			clearInterval(intervalId); // 8回でタイマーを停止
		}
		i++;

	 }, 40);

}


//立て看板の文字を表示するかどうか
function enabelLabels(enable,end)
{
	let i=0;
	let n=0;
    	let p=[0,0];		//TPoint
	//let n2=datCommaTxt.length;
	
	//
	for(i=0;i<end+1;i++)	//Level2,3での立て看板の文字
	{
		n=i+10;		//labelのID番号はlabel10から始まるから
		let TextMato=document.getElementById('label'+n);
		if(TextMato)
		{
    			p=GetTarPos(i+1);
    			xT=p[0]; yT=p[1];
    	　　　		//alert("xT="+xT+" yT="+yT);
			
			if(enable==1)
			{
				TextMato.value=datCommaTxt[i+2];
				TextMato.style.display='block';
				//ctx0.drawImage(imageMato, 80, 0, 80, 115, xT, yT, 80, 115);

			}
			else
			{
				TextMato.style.display='none'; 
				//ctx0.drawImage(imageDumy, xT, yT, 80, 115, xT, yT, 80, 115);
			}
		}
		else{		alert("nagative");		}

	}

	i=0;				//以下のインターバルがないと画像が表示されない→めんどくさい！
	const intervalId = setInterval(function()
	{
	  if(Level!=1)
	  {	
	   	//次に、立て看板
	   	if(enable==1)
	     	{
			ctx0.drawImage(imageMatoAll, 10, 0, 100*(end+1), 115,  10, 400, 100*(end+1), 115, );
	     	}
	   	else
	     	{
			ctx0.drawImage(imageDumy, 0, 400, 1024, 115, 0, 400, 1024, 115);
	     	}
	     	if (i === 1)
		{
			clearInterval(intervalId); // １回でタイマーを停止
		}
		i++;
	  }

	}, 40);

}


function GetTarPos(k)		//ターゲットの座標
{

	if(k==10){	k=0	}	//これがないと、Level2,3で、10番目の立て看板のアニメができない

	let s1='1234567890';
	let s2='!qaz';
	let s3='1234567890';
	let index=0;

	if(Level==1)
	{
		if(s1.includes(k))
		{
			index=s1.indexOf(k)+1;
			return [100+70*(index-1),400-150-20];
		}
		else if(s2.includes(k))
		{
			index=s2.indexOf(k)+1;
			return [100+30*(index-1),400+70*(index-1)-150-20];
		}
		else{	return [0,0];	}

	}
	else if(Level==2 || Level==3)
	{
		if(s3.includes(k))
		{
			index=s3.indexOf(k);
			return [15+100*index,400];			
		}
		else{	return [0,0];	}

	}
	else{    return [0,0];	}

}


function GetSourcePoint(k)		//ソース元の座標
{

	let s1='1234567890';
	let s2='qQwWeErRtTyYuUiIoOpP';
	let s3='aAsSdDfFgGhHjJkKlL;';
	let s4='zZxXcCvVbBnNmM';
	let s5=',./';
	let s6='!';
	let index=0;
	let m=0;

	if(Level==1)
	{
		if(s1.includes(k))
		{
			index=s1.indexOf(k)+1;
			return [10+70*(index-1),0];
		}
		else if(s2.includes(k))
		{
			index=s2.indexOf(k)+1;
			m=Math.floor((index+1)/2)-1;
			return [40+70*m,70];
		}
		else if(s3.includes(k))
		{
			index=s3.indexOf(k)+1;
			m=Math.floor((index+1)/2)-1;
			return [70+70*m,140];
		}
		else if(s4.includes(k))
		{
			index=s4.indexOf(k)+1;
			m=Math.floor((index+1)/2)-1;
			return [100+70*m,210];
		}
		else if(s5.includes(k))
		{
			index=s5.indexOf(k)+1;
			return [100+70*(index+6),210];
		}
		else if(s6.includes(k))
		{
			//index=s6.indexOf(k)+1;
			return [10,0];
		}
		else
		{	return [0,0];	}

	}
	else if(Level==2 || Level==3)
	{
		if(s1.includes(k))
		{
			index=s1.indexOf(k)+1;
			return [80*(index-1),0];
		}
		else{	return [0,0];	}

	}
	else{    return [0,0];	}     

}

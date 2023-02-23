function LoadHeader(pre)
{
	pre = (!pre) ? "" : pre; 
	let url = pre + 'header.html';
	console.log("Loading Header at " + url); 

	fetch(url)
	.then(response => response.text())
	.then(text => document.getElementById('header').innerHTML = text);
}

function ParseRSSThenReturnIndex(url, passedNum)
{
	fetch(url)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => 
		{
			let html = '';
			let channel = data.querySelector('channel');
			let channelTitle = channel.querySelector('title').textContent;
			let items = channel.querySelectorAll('item');

			html += '<p>';
			num = passedNum;
			console.log(num);
			num = items.length - num;
			console.log(num); 

			let item = items.item(num);

			let title = item.querySelector('title').textContent;
			let link = item.querySelector('link').textContent;
			let pubDate = item.querySelector('pubDate').textContent;
			let description = item.querySelector('description').textContent;
			let content = item.querySelector('content').textContent;
			let ytLink = item.querySelector('ytlink').textContent;
			let vidID = url.split("v=")[1]; 

			console.log(`Displaying content for episode ${item.querySelector('title').textContent} (vidID=${vidID})`); 

			html += `<h2 style="padding-bottom:0px;">${title}</h2>`;
			html += `<h3 style="text-align:left;">${pubDate}</h3>`; 
			html += `<h4 style="text-align:left;">${description}</h4>`; 
			html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${vidID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
			html += `${content}`;
			html += '</p>';

			return html;
		})
		.then(text => document.getElementById('rss').innerHTML = text);
}

function ParseAllRSS(url) 
{
	fetch(url)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => 
		{
			let html = '';
			let channel = data.querySelector('channel');
			let channelTitle = channel.querySelector('title').textContent;
			let items = channel.querySelectorAll('item');
			html += '<h1>' + "ARCHIVE:" + '</h1>';
			html += '<p>';
			// let channelNum = title.split(":")[0];

			items.forEach(item => {
				let title = item.querySelector('title').textContent;
				let episodeNum = title.split(":")[0]; 
				let url = `episodes/${episodeNum}.html` 

				html += `<A href="#" onclick="OpenNewPage('${title.split(":")[0]}')"> <h2 style="padding-bottom:0px;">${title}</h2></A>`;
				html += `<br>`
			});
			html += '</p>';

			return html;
		})
		.then(text => document.getElementById('rss').innerHTML = text);
}

function ParseRSSToCount(url, count) 
{
	fetch(url)
		.then(response => response.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => 
		{
			let n = 0; 
			let html = '';
			let channel = data.querySelector('channel');
			let channelTitle = channel.querySelector('title').textContent;
			let items = channel.querySelectorAll('item');
			html += '<h1>' + "LATEST EPISODES:" + '</h1>';
			html += '<p>';

			items.forEach(item => {
				n++; 
				
				if (n <= count)
				{
					let title = item.querySelector('title').textContent;
					let link = item.querySelector('link').textContent;
					let pubDate = item.querySelector('pubDate').textContent;
					let description = item.querySelector('description').textContent;
					let content = item.querySelector('content').textContent;
					let ytLink = item.querySelector('ytlink').textContent;
					let vidID = ytLink.split("v=")[1]; 
					let epNum = title.split(":")[0];

					// Pad epNum 
					while (epNum.length < 3) 
					{
						epNum = "0" + epNum;
					}

					html += `<a href="/LowHP/episodes/${epNum}" style="padding-bottom:0px;"><h2>${title}</h2></a>`;
					html += `<h3 style="text-align:left;">${pubDate}</h3>`; 
					html += `<h4 style="text-align:left;">${description}</h4>`; 
					html += `<iframe width=560 height=315 src="https://www.youtube.com/embed/${vidID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
					html += `${content}`;
					html += `<br><br>`
				}
			});

			html += `<a class="hunterlink" style="font-size: 35px; padding-right:10px;" href="archive.html"><b>ARCHIVE</b></a>`
			html += `<br><br><br>`
			html += '</p>';

			return html;
		})
		.then(text => document.getElementById('rss').innerHTML = text);
}

function OpenNewPage(passedNum) 
{
	var str = passedNum; 

	while (str.length < 3) {
        str = "0" + str;
    }

	window.location.href = `https://persomatey.github.io/LowHP/episodes/${str}.html`;

	// Dynamic HTML approach
	// var newWindow = window.open();
	// newWindow.onload = function() 
	// {
	// 	var html = 
	// 	`
	// 	<!doctype html> 
	// 	<html style="background-color:#283850;"> 
		
	// 		<head>
	// 			<title>Episode ${passedNum}</title>
	// 			<link rel="stylesheet" type="text/css" href="style.css">
	// 			<script src="scripts.js"></script>
	// 			<meta name="viewport" content="width=device-width, initial-scale=1.0">
	// 		</head>
		
	// 		<body style="background-color:#283850;" >
		
	// 			<!-- Header -->
		
	// 			<script>LoadHeader()</script>
	// 			<div id="header"></div>
		
	// 			<!-- Contents -->
		
	// 			<div class="row">
	// 				<div class="columnside">
	// 					<p></p>
	// 				</div>
		
	// 				<div class="column">
	// 					<script>ParseRSSThenReturnIndex("thelowhppodcast.rss", ${passedNum})</script>
	// 					<div id="rss" style="padding-left:15px"></div>
	// 					<a class="hunterlink" style="font-size: 35px; padding-right:10px; padding-left:15px;" href="archive.html"><b>ARCHIVE</b></a>
	// 					<br><br><br>
	// 				</div>
		
	// 				<div class="columnside">
	// 					<p></p>
	// 				</div>
	// 			</div>
		
	// 			<!-- Footer -->
		
	// 		</body>
	// 	</html>
	// 	`;

	// 	newWindow.document.write(html);
	// 	window.close();
	// }

	// Try this 
	// var newTab = window.open('about:blank', '_blank');
	// newTab.document.open();
	// newTab.document.write(html);
	// newTab.document.close();

	// Or this 
	// var newTab = window.open("", "", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
	// newTab.document.write(html);
	// newTab.document.close();

	// Or this 
	// var newTab;
	// if (typeof window.open !== 'undefined') 
	// {
	// 	newTab = window.open();
	// } 
	// else 
	// {
	// 	newTab = window.open('about:blank', '_blank');
	// 	newTab.document.write(html);
	// 	newTab.document.close();
	// }

	// Or this 
	// var newTab = window.open('', '_blank');
	// newTab.document.write(html);
	// newTab.document.close();
}

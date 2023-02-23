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
			let items = channel.querySelectorAll('item');

			html += '<p>';
			num = passedNum;
			num = items.length - num;

			let item = items.item(num);

			let title = item.querySelector('title').textContent;
			let pubDate = item.querySelector('pubDate').textContent;
			let description = item.querySelector('description').textContent;
			let content = item.querySelector('content').textContent;
			let ytLink = item.querySelector('ytlink').textContent;
			let vidID = ytLink.split("v=")[1]; 

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
			let items = channel.querySelectorAll('item');
			html += '<h1>' + "ARCHIVE:" + '</h1>';
			html += '<p>';

			items.forEach(item => {
				let title = item.querySelector('title').textContent;
				let epNum = title.split(":")[0];

				// Pad epNum 
				while (epNum.length < 3) 
				{
					epNum = "0" + epNum;
				}

				html += `<a href="/LowHP/episodes/${epNum}"> <h2 style="padding-bottom:0px;">${title}</h2></a>`;
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
			let items = channel.querySelectorAll('item');
			html += '<h1>' + "LATEST EPISODES:" + '</h1>';
			html += '<p>';

			items.forEach(item => {
				n++; 
				
				if (n <= count)
				{
					let title = item.querySelector('title').textContent;
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


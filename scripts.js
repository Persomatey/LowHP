function LoadHeader()
{
	console.log("Loading Header"); 

	fetch('header.html')
	.then(response => response.text())
	.then(text => document.getElementById('header').innerHTML = text);
}

function LoadFooter()
{
	console.log("Loading Footer"); 

	fetch('footer.html')
	.then(response => response.text())
}

function ParseRSSThenReturnIndex(url)
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

			var num = window.location.pathname;
			num = GetEpisodeNumberFromURL(num); 
			num = num.replace(".html", ""); 
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
			let vidID = GetVideoID(ytLink); 

			html += `<h2 style="padding-bottom:0px;">${title}</h2>`;
			html += `<h3 style="text-align:left;">${pubDate}</h3>`; 
			html += `<h4 style="text-align:left;">${description}</h4>`; 
			html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${vidID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
			html += `${content}`;
			html += `<br><br><br>`

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

			items.forEach(item => {
				let title = item.querySelector('title').textContent;
				let episodeNum = GetEpisodeNumber(title); 
				let url = `episodes/${episodeNum}.html` 

				html += `<A href="${url}"> <h2 style="padding-bottom:0px;">${title}</h2></A>`;
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
					let vidID = GetVideoID(ytLink); 

					html += `<h2 style="padding-bottom:0px;">${title}</h2>`;
					html += `<h3 style="text-align:left;">${pubDate}</h3>`; 
					html += `<h4 style="text-align:left;">${description}</h4>`; 
					html += `<iframe width=560 height=315 src="https://www.youtube.com/embed/${vidID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
					html += `${content}`;
					html += `<br><br><br>`
				}
			});

			html += `<a class="hunterlink" style="font-size: 35px; padding-right:10px;" href="archive.html"><b>ARCHIVE</b></a>`
			html += `<br><br><br>`
			html += '</p>';

			return html;
		})
		.then(text => document.getElementById('rss').innerHTML = text);
}

function GetVideoID(url) 
{
	var ret = url.split("v=")[1];
	return ret;
}

function GetEpisodeNumberFromURL(url) 
{
	var ret = url.split("episodes/")[1];
	return ret;
}

function GetEpisodeNumber(str)
{
	var ret = str.split(":")[0];
	return ret; 
}

document.getElementById('nyt').addEventListener("click", loadnyt);
document.getElementById('ts').addEventListener("click", loadts);

//load news from New York Times
function loadnyt() {
    //refresh newscards by clearing newscardcontainer
    var newscard = document.getElementById(`newscardcontainer`);
    newscard.innerHTML = '';
    // fetch
    var url = `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`;
    fetch(url)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            //get title
            document.getElementById('header').innerHTML = data.getElementsByTagName("title")[0].childNodes[0].data;
            //display Top10 news cards
            for (var i = 0; i < 11; i++) {
                //title
                var title = data.getElementsByTagName("item")[i].childNodes[1].innerHTML;
                //publication date
                var pubdate = data.getElementsByTagName("item")[i].childNodes[13].innerHTML;
                // description
                var description = data.getElementsByTagName("item")[i].childNodes[9].innerHTML;
                //image
                var img = data.getElementsByTagName("media:content")[i].attributes[2].nodeValue;
                //link
                var link = data.getElementsByTagName("item")[i].children[3].attributes[0].nodeValue;

                //create Top10 news card
                createnewscard(newscard, i);
                document.getElementById(`title${i}`).innerHTML = title;
                document.getElementById(`img${i}`).src = img;
                document.getElementById(`date${i}`).innerHTML = pubdate;
                document.getElementById(`text${i}`).innerHTML = description;
                document.getElementById(`link${i}`).href = link;
            }

        })
        .catch(err => alert(err))
}

//load news from tagesschau
function loadts() {
    console.log("loadts");

    //refresh newscards
    var newscard = document.getElementById(`newscardcontainer`);
    newscard.innerHTML = '';

    //cors-anywhere proxy server operates in between the frontend web app making the request, and the server that responds with data
    var url = `https://cors-anywhere.herokuapp.com/https://www.tagesschau.de/xml/rss2_https/`;

    //fetch
    fetch(url)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            console.log("Click");
            console.log(data);
            document.getElementById('header').innerHTML = data.getElementsByTagName("title")[0].childNodes[0].data;

            console.log(data.getElementsByTagName("item"));
            console.log(data.getElementsByTagName("content:encoded"));
            //console.log(data.getElementsByTagName("content:encoded")[0].innerHTML);

            //display Top10 news cards
            for (var i = 0; i < 11; i++) {
                //title
                var title = data.getElementsByTagName("item")[i].childNodes[1].innerHTML;
                //publication date
                var pubdate = data.getElementsByTagName("item")[i].childNodes[5].innerHTML;
                // description
                var description = data.getElementsByTagName("item")[i].childNodes[9].innerHTML;
                //image
                var img = data.getElementsByTagName("content:encoded")[i].innerHTML;
                //link
                var link = data.getElementsByTagName("item")[i].children[1].innerHTML;

                //get imgurl out of tagesschau content:encoded
                img = extract_imgurl_ts(img);

                //create Top10 news card
                createnewscard(newscard, i);
                //fill up cards
                console.log(`fill up card ${i}`);
                document.getElementById(`title${i}`).innerHTML = title;
                //extra sausage for img tagesschau
                document.getElementById(`img${i}`).style.width = "300px";
                document.getElementById(`img${i}`).style.height = "150px";

                document.getElementById(`img${i}`).src = img;
                document.getElementById(`date${i}`).innerHTML = pubdate;
                document.getElementById(`text${i}`).innerHTML = description;
                document.getElementById(`link${i}`).href = link;
            }
        })
        .catch(err => alert(err))
}

//create newscard dynamically
function createnewscard(newscard, i) {
    console.log(`create card ${i}`);
    //creates i formated cards
    console.log("Click");
    newscard.innerHTML += `<section id="newscard">
        <div class="card">
            <div class="card-header bg-light text-center">
            <!--title-->
            <h3 id="title${i}"></h3>
            </div>
            <div class="card-body bg-dark">
                <div class="card-deck" align="center">
                <!--image-->
                    <img id="img${i}" class="ml-2" style="width:250px; height:250px">
                    <div class="card " align="left">
                        <div class="card-body w-100 bg-secondary text-white">
                            <!--pubdate-->
                            <h5 id="date${i}" class="text-dark"></h5>
                            <!--text-->
                            <div id="text${i}"></div>
                            <!--link-->
                            <a id="link${i}">Read more.</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

//get image URL of tagesschau
function extract_imgurl_ts(img) {
    //cuts out imgurl
    const startstring = img.indexOf("<img");
    //console.log(startstring);
    const endstring = img.indexOf(".jpg");
    //console.log(endstring);
    var imgurl = img.slice(startstring + 10, endstring + 4);
    //console.log(imgurl);
    return imgurl
}


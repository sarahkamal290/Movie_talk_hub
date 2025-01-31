async function searchMovie() {
    const movieName = document.getElementById('movie-search').value.trim();
    if (!movieName) {
        alert("Please enter a movie name.");
        return;
    }

    const apiKey = '9b99d9c4b54ae67119a040ccc34da43b';
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;

    try {
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        displayMovieDetails(data.results[0]);
        fetchTwitterReactions(movieName); // Fetch tweets after movie details
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

function displayMovieDetails(movie) {
    const movieInfo = document.getElementById('movie-info');
    if (!movie) {
        movieInfo.innerHTML = '<p>No movie found.</p>';
        return;
    }
    movieInfo.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    `;
}

async function fetchTwitterReactions(movieName) {
    const twitterBearerToken = 'AAAAAAAAAAAAAAAAAAAAAC9xygEAAAAAaR%2BcCMNk0DuOuHbz%2BPpc6mzj56s%3DLVyTxr59LJtQ2JQJmI2XZ8bwx6YhtiVzSxq4BDjEkjxPl5qjOW';
    const twitterUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(movieName)}&max_results=5`;

    try {
        const response = await fetch(twitterUrl, {
            headers: {
                "Authorization": `Bearer ${twitterBearerToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tweets");
        }

        const data = await response.json();
        displayTweets(data.data);
    } catch (error) {
        console.error("Error fetching Twitter data:", error);
        document.getElementById('tweets').innerHTML = "<p>Could not load tweets.</p>";
    }
}

function displayTweets(tweets) {
    const tweetsContainer = document.getElementById('tweets');
    tweetsContainer.innerHTML = '';

    if (!tweets || tweets.length === 0) {
        tweetsContainer.innerHTML = '<p>No tweets found for this movie.</p>';
        return;
    }

    tweets.forEach(tweet => {
        const tweetElement = document.createElement('div');
        tweetElement.classList.add('tweet');
        tweetElement.innerHTML = `
            <p>${tweet.text}</p>
            <a href="https://twitter.com/i/web/status/${tweet.id}" target="_blank">View Tweet</a>
        `;
        tweetsContainer.appendChild(tweetElement);
    });
}

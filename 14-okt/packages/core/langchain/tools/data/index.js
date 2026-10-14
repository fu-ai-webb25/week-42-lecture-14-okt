import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fetchMovies, fetchSearch } from '@chat-app/api';

export const getMovies = tool(
    async () => {
        const movies = await fetchMovies();
        return JSON.stringify(
            movies.map(({id, title, description}) => ({
                id, title, description
            }))
        );
    },
    {
        name : 'get_movies',
        description : 
            'Hämtar biografens aktuella utbud med ID, filmtitel och beskrivning. Används för att hitta en film eller ge användaren rekommendationer.',
        schema : z.object({})
    }
);

export const getShowtimes = tool(
    async ({movie}) => {
        const movies = await fetchMovies();
        console.log('MOVIE IN SHOWTIMES', movie);

        const selectedMovie = movies.find(
            item =>
                item.id === movie ||
                item.title.toLowerCase().includes(movie.toLowerCase())
        );

        if(!selectedMovie) {
            return 'Filmen hittades ej';
        }

        return JSON.stringify({
            title : selectedMovie.title,
            showtimes : selectedMovie.showtimes
        });
    },
    {
        name : 'get_showtimes',
        description : 
            'Hämtar alla visningar för en specifik film utifrån filmens titel eller ID.',
        schema : z.object({
            movie : z.string().describe(
                'Filmens titel eller ID, exemelvis "Monster och Minioner" eller "movie-001"'
            )
        })
    }
);
const bookings = [];

export const createBooking = tool(
    async ({ title, showtime, tickets }) => {
        const movies = await fetchMovies();

        const selectedMovie = movies.find(
            movie => movie.title.toLowerCase().includes(title.toLowerCase())
        );
        
        if(!selectedMovie) {
            return 'Filmen hittade ej.'
        }
        if(!selectedMovie.showtimes.includes(showtime)) {
            return 'Filmen visas inte vid den angivna tiden';
        }

        const booking = {
            id : crypto.randomUUID().slice(0, 5),
            movieId : selectedMovie.id,
            title : selectedMovie.title,
            showtime,
            tickets
        }

        bookings.push(booking);

        return JSON.stringify({
            success :  true,
            booking
        });
    },
    {
        name : 'create_booking',
        description : 'Skapar en bokning av biobiljetter',
        schema : z.object({
            title : z.string().describe('Filmens titel'),
            showtime : z.string().describe('Filmens visningstid'),
            tickets : z.coerce.number().int().positive().describe('Antal biljetter')
        })
    }
);

export const searchWeb = tool(
    async ({ query }) => {
        const data = await fetchSearch(query);

        const results =  data.results.map(result => ({
            title : result.title,
            url : result.url,
            content : result.content
        }));

        console.log('SEARCH RESULTS', results);
        return JSON.stringify(results);

    }, 
    {
        name : 'search_web',
        description : 'Söker efter aktuell information gällande filmer på internet',
        schema : z.object({
            query : z.string().describe('Sökfrågan')
        }) 
    }
);

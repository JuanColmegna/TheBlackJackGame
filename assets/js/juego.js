/*
* 2C = two of clubs (dos de treboles)
* 2D = two of diamonds (dos de diamantes)
* 2H = two of hearts (dos de corazones)
* 2s = two of spades (dos de espadas)
*/

//patrón modulo (funcion anónima auto-invocada)

const miModulo = (() => {
    'use strict'; // para evitar errores

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // referencias en HTML

    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');
        
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');


    //esta funcion inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);

        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnDetener.disabled = false;
        btnPedir.disabled = false;

    }

    // esta funcion crea una nueva baraja
    const crearDeck = () => {

        deck = [];

        for (let i = 2; i <= 10; i++) {
            for(let tipo of tipos){
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos){
            for(let esp of especiales){
                deck.push(esp + tipo)
            }
        }
        return _.shuffle(deck);
    }

    // esta funcion me permite tomar una carta
    const pedirCarta = () =>{
        if(deck.length === 0){
            throw 'No hay cartas en la baraja';
        }
        return deck.pop();
    }

    // esta funcion determina el valor de la carta
    const valorCarta = (carta) =>{
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) 
            ? (valor === 'A') ? 11 : 10
            : (valor * 1);
    }

    // acumular puntos
    // turno 0 = primer jugador, y último será la computadora
    const acumularPuntos = (carta, turno) =>{
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }


    const crearCarta = (carta, turno) =>{
        const imgCarta = document.createElement('img');
        imgCarta.src = `./assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }


    const determinarGanador = () =>{
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(()=> {
            if (puntosComputadora === puntosMinimos){
                alert('Nadie gana');
            } else if (puntosMinimos > 21){
                alert('Computadora gana');
            } else if ( puntosComputadora > 21){
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 30);
    }

    // turno de la computadora

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
        const carta = pedirCarta();
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
        crearCarta(carta, puntosJugadores.length - 1);

        } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

        determinarGanador();
    }

    // eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if(puntosJugador > 21){
            console.warn('lo siento mucho ya perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        } else if (puntosJugador === 21){
            console.warn('21, genial');
            btnDetener.disabled = true;
            btnPedir.disabled = true;
            turnoComputadora( puntosJugador );
        } 
    })



    btnDetener.addEventListener('click', () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    })


    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    })

    //esto va a ser publico y todo lo demas va a ser privado
    return {
        nuevoJuego: inicializarJuego //nuevoJuego será la forma en la que se podrá llamar a inicializar juego desde afuera del módulo
    };
})();

window.addEventListener('DOMContentLoaded', () => {

    const imgPokemon = document.getElementById('img-pokemon');
    const descriptionDiv = document.getElementById('description');
    const initialImg = imgPokemon.src;
    const results = document.getElementById('results');
    const pokeName = document.getElementById('pokeName');
    const resName = document.getElementById('resName');
    const resType = document.getElementById('resType');
    const spriteContainer = document.getElementById('sprites-container');
    const resEstats = document.getElementById('resEstats');
    const resMovement1 = document.getElementById('resMovement1');
    const resMovement2 = document.getElementById('resMovement2');
    const colorClass = [
        'bg-success',
        'bg-warning',
        'bg-info',
        'bg-secondary',
        'bg-dark'
    ];

    const getPokemon = async () => {
        const value = pokeName.value.toLowerCase();
        if(pokeName.disabled || value === '') return;
        const url = `https://pokeapi.co/api/v2/pokemon/${value}`;
        imgPokemon.src = 'assets/img/loading.gif';
        pokeName.classList.add('loading');
        pokeName.disabled = true;
        const response = await fetch(url);
        if(response.status === 200) {
            const data = await response.json();
            results.classList.remove('d-none');
            processData(data);
        } else {
            Swal.fire({
                imageUrl: 'assets/img/404.gif',
                title: `Pokémon ${value} no localizado.`,
                footer: 'Favor de intentarlo nuevamente.',
                padding: '1em',
                confirmButtonColor: '#AD1218',
                backdrop: 'rgba(173,18,24,0.4)'
            }).then(() => {
                imgPokemon.src = initialImg;
                descriptionDiv.innerText = '';
                results.classList.add('d-none');
                pokeName.classList.remove('loading');
                pokeName.disabled = false;
                pokeName.value = '';
                pokeName.focus();
            });
        }
    }

    const processData = (data) => {
        console.log(data);
        spriteContainer.innerHTML = '';
        resEstats.innerHTML = '';
        imgPokemon.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(data.id).padStart(3,'0')}.png`;
        pokeName.classList.remove('loading');
        pokeName.disabled = false;
        pokeName.dataset.id = data.id;
        resName.innerText = data.name;
        let tempType = [];
        data.types.forEach(element => {
            const name = element.type.name;
            tempType.push(name);
            const spriteType = document.createElement('div');
            spriteType.classList.add('col-sm-4', 'sprite', `sprite-${name}`);
            spriteContainer.appendChild(spriteType);
        });
        resType.innerText = tempType.join(', ');
        // data.stats.forEach(stat => {
        for(let i in data.stats) {
            const stat = data.stats[i];
            const statDiv = document.createElement('div');
            statDiv.classList.add('progress-bar', 'progress-bar-striped', 'progress-bar-animated', colorClass[i]);
            statDiv.role = 'progressbar';
            statDiv.style.width = `${stat.base_stat}%`;
            const span = document.createElement('span');
            span.classList.add('text-center', 'text-white', 'fw-bold');
            span.innerHTML = `${stat.stat.name} ${stat.base_stat}%`;
            statDiv.appendChild(span);
            const statDivParent = document.createElement('div');
            statDivParent.classList.add('progress', 'screen');
            statDivParent.appendChild(statDiv);
            const col = document.createElement('span');
            col.classList.add('col-sm-12', 'my-1');
            col.appendChild(statDivParent)
            resEstats.appendChild(col);
        }
        // });
        resMovement1.innerHTML = data.abilities[0].ability.name;
        if(data.abilities[1] !== undefined) {
            resMovement2.innerHTML = data.abilities[1].ability.name;
            resMovement2.classList.remove('d-none');
        } else {
            resMovement2.innerHTML = '';
            resMovement2.classList.add('d-none');
        }
        addDescription(data.id);
    };

    const addDescription = (id) => {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
        fetch(url).then(response => {
            if(response.status === 200) {
                return response.json();
            } else {
                console.error(response);
            }
        }).then((data) => {
            console.log(data);
            let description = '';
            description += data.flavor_text_entries.find(element => element.language.name === 'es').flavor_text;
            descriptionDiv.innerText = description;
        }).catch(e => console.error(e));
    };

    const btnSearch = document.getElementById('search');
    btnSearch.addEventListener('click', getPokemon);

    pokeName.addEventListener('keyup', (e) => {
        console.log(e);
        if(e.keyCode == 13) getPokemon()
    });

    const increse = document.getElementById('increase');
    increse.addEventListener('click', () => {
        pokeName.value = parseInt(pokeName.dataset.id) + 1;
        getPokemon();
    });

    const decrese = document.getElementById('decrease');
    decrese.addEventListener('click', () => {
        pokeName.value = parseInt(pokeName.dataset.id) - 1;
        getPokemon();
    });
});


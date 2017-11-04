/* global document */
import Api from './Api';

export default class ContextualMenu {
    map: any;
    am: any;
    dom: any;
    visible: any;
    constructor(map, am) {
        this.map = map;
        this.am = am;
        this.dom = document.getElementById('contextualMenu');
        this.visible = false;
        this.dom.addEventListener('click', (e) => this.click(e));
    }

    click(e) {
        const target = e.target || e.srcElement;
        const action = e.target.getAttribute('data-action');
        if (action !== null) {
            this[action](target);
        }
    }

    hide() {
        this.visible = false;
        this.dom.style.display = 'none';
    }

    show(o, populate) {
        this[`populate${populate}`]();
        this.visible = true;
        this.dom.style.display = 'block';
        this.dom.style.left = `${o.x}px`;
        this.dom.style.top = `${o.y}px`;
    }

    isVisible() {
        return this.visible;
    }

    actionPlaceTile(target) {
        this.hide();
        const id = target.getAttribute('data-tileid');
        const coord = this.map.curentSelection;
        const tile = this.map.getTile({x: coord.x, y: coord.y});
        tile.type = id;
        Api.updateTile(tile);
    }

    actionPlaceObject(target) {
        this.hide();
        const id = target.getAttribute('data-tileid');
        const coord = this.map.curentSelection;
        const tile = this.map.getTile({x: coord.x, y: coord.y});
        tile.content = [{id: id}];
        Api.updateTile(tile);
    }

    actionSubMenu(target) {
        const submenu = target.getAttribute('data-submenu');
        this[submenu]();
    }

    populatePlaceTile() {
        let population = '<div class="title">'
            + 'Poser une Tile'
            + '</div>'
            + '<ul>';

        for (const key in this.am._assets.tile) {
            const tile = this.am._assets.tile[key];
            if (tile.usable !== undefined && tile.usable) {
                population += `<li class="half"><img data-action="actionPlaceTile" data-tileid="${tile.id}" src="${tile.src}"></li>`;
            }
        }
        population += '</ul>';
        this.dom.innerHTML = population;
    }

    populatePlaceObject() {
        let population = '<div class="title">'
            + 'Poser un Objet'
            + '</div>'
            + '<ul>';

        for (const key in this.am._assets.object) {
            const tile = this.am._assets.object[key];
            if (tile.usable !== undefined && tile.usable) {
                population += `<li class="half"><img data-action="actionPlaceObject" data-tileid="${tile.id}"src="${tile.src}"></li>`;
            }
        }
        population += '</ul>';
        this.dom.innerHTML = population;
    }

    populateMainMenu() {
        let population = '<div class="title">'
            + 'Choisir une action'
            + '</div>'
            + '<ul>';
        population += '<li class="sub" data-action="actionSubMenu" data-submenu="populatePlaceTile">Poser une Tile</li>';
        population += '<li class="sub" data-action="actionSubMenu" data-submenu="populatePlaceObject">Poser un Objet</li>';
        population += '</ul>';
        this.dom.innerHTML = population;
    }
}

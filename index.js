const DEFAULT_PADDING = 41;
const HIDING_TIMEOUT = 250;

const DEFAULT_ROW_NUMBER = 4;
const DEFAULT_COL_NUMBER = 4;

const HTML_TEMPLATE = `
    <div class="table"><table></table></div>
    <div class="add right button">+</div>
    <div class="add bottom button">+</div>
    <div class="remove top button">-</div>
    <div class="remove left button">-</div>
`;

class SquaresBuilder {
    container;
    table;

    addColButton;
    addRowButton;
    removeColButton;
    removeRowButton;

    x = -1;
    y = -1;

    constructor() {
        this.container = document.querySelector('.main');
        this.container.innerHTML = HTML_TEMPLATE;

        this.table = document.querySelector('.main .table table');

        this.addColButton = document.querySelector('.main .add.right.button');
        this.addRowButton = document.querySelector('.main .add.bottom.button');
        this.removeColButton = document.querySelector('.main .remove.top.button');
        this.removeRowButton = document.querySelector('.main .remove.left.button');

        /* methods binding */
        this.hideRemoveButtons = this.hideRemoveButtons.bind(this);
        this.addRow = this.addRow.bind(this);
        this.addCol = this.addCol.bind(this);

        this.addColButton.addEventListener('click', this.addCol);
        this.addRowButton.addEventListener('click', this.addRow);
        this.removeColButton.addEventListener('click', () => this.removeCol(this.y));
        this.removeRowButton.addEventListener('click', () => this.removeRow(this.x));

        this.table.onmouseover = (event) => {
            if (!(event.target instanceof HTMLTableCellElement)) return;
            this.showRemoveButtons(event.target.offsetLeft, event.target.offsetTop);

            this.x = event.target.parentNode.rowIndex;
            this.y = event.target.cellIndex;
        }

        this.table.addEventListener('mouseleave', (event) => {
            if ([this.removeRowButton, this.removeColButton].includes(event.relatedTarget)) return;
            this.hideRemoveButtons();
        });

        this.removeColButton.addEventListener('mouseleave', this.hideRemoveButtons);
        this.removeRowButton.addEventListener('mouseleave', this.hideRemoveButtons);

        /* build initial rectangle */
        for (let i = 0; i < DEFAULT_ROW_NUMBER; i++) this.addRow();
    }

    hideRemoveButtons() {
        setTimeout(() => {
            this.removeColButton.style.display = 'none';
            this.removeRowButton.style.display = 'none';
        }, HIDING_TIMEOUT);
    }

    showRemoveButtons(offsetLeft, offsetTop) {
        if (this.table.rows[0].cells.length > 1) {
            this.removeColButton.style.display = 'block';
            this.removeColButton.style.left = `${DEFAULT_PADDING + offsetLeft}px`;
        }
        if (this.table.rows.length > 1) {
            this.removeRowButton.style.display = 'block';
            this.removeRowButton.style.top = `${DEFAULT_PADDING + offsetTop}px`;
        }
    }

    addRow() {
        const row = this.table.insertRow();
        const length = this.table.rows[0].cells.length || DEFAULT_COL_NUMBER;
        for (let i = 0; i < length; i++) row.insertCell();
    }

    addCol() {
        for (let i = 0; i < this.table.rows.length; i++) this.table.rows[i].insertCell();
    }

    removeRow(index) {
        this.table.deleteRow(index);
        this.hideRemoveButtons();
    }

    removeCol(index) {
        for (let i = 0; i < this.table.rows.length; i++) this.table.rows[i].deleteCell(index);
        this.hideRemoveButtons();
    }
}

(() => new SquaresBuilder())();

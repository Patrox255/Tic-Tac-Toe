var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
var gameBoard = (function() 
{
    var board = document.getElementById("gameBoard");
    var firstName = document.getElementById("first");
    var secondName = document.getElementById("second");
    var namesDiv = document.getElementById("names");

    function DOMCache()
    {
        board = document.getElementById("gameBoard");
        firstName = document.getElementById("first");
        secondName = document.getElementById("second");
        namesDiv = document.getElementById("names");   
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    var playerOneName = "";
    var playerSecondName = "";
    var player;
    var boardPoints;
    var won;
    var lastAdded;
    var lastTime;

    function pageLoad()
    {
        let inner='<div id="container"><div id="header"><span><i class="fas fa-times"></i>Tic-Tac-Toe Game<i class="far fa-circle"></i></span></div><div id="main"><div id="names"><div class="name"><label>First player name:<input type="text" id="first"></label></div><div class="name"><label>Second player name:<input type="text" id="second"></label></div></div><div id="gameBoard"><input type="submit" class="mySubmit" value="Confirm" onclick="gameBoard.nameConfirm()"></div></div></div>';
        document.body.innerHTML = inner;
        init();
    }

    function init()
    {
        player=0;
        boardPoints = [];
        won=0;
        lastAdded=0;
        lastTime=0;
        DOMCache();
    }

    function render() {
        board.innerHTML="";
        var header = document.createElement('h1');
        board.appendChild(header);
        if (player==0)
        {
            header.innerHTML = playerOneName+' turn';
            var mainTable = document.createElement("table");
            board.appendChild(mainTable);
            var firstRow = document.createElement("tr");
            mainTable.appendChild(firstRow);
        }
        else 
        {
            header.innerHTML = playerSecondName+' turn';
            var mainTable = document.createElement("table");
            board.appendChild(mainTable);
            var firstRow = document.createElement("tr");
            mainTable.appendChild(firstRow);
        }
        for (let i=1; i<10; i++)
        {
            if (boardPoints[i] == undefined) {
                boardPoints[i] = "";
            }
            if (i%3 == 0 && i!=9)
            {
                let row = mainTable.lastElementChild;
                row.className="boardRows";
                let cell = document.createElement("td");
                cell.id = "cell"+i;
                cell.className = "boardCells";
                row.appendChild(cell);
                if (!won)
                {
                    cell.addEventListener("click", gameBoard.userClick.bind(this, i));
                }
                let icon = document.createElement("i");
                if (boardPoints[i]=="x")
                {
                    icon.className += " fas fa-times";
                }
                else if (boardPoints[i]=="o")
                {
                    icon.className += " far fa-circle";
                }
                cell.appendChild(icon);
                let newRow = document.createElement("tr");
                mainTable.appendChild(newRow);
                newRow.className="boardRows";
                if (lastAdded == i)
                {
                    icon.className+=" fadeIn";
                }
            }
            else {
                let row = mainTable.lastElementChild;
                let cell = document.createElement("td");
                cell.id = "cell"+i;
                cell.className = "boardCells";
                row.appendChild(cell);
                if (!won)
                {
                    cell.addEventListener("click", gameBoard.userClick.bind(this, i));
                }
                let icon = document.createElement("i");
                if (boardPoints[i]=="x")
                {
                    icon.className += " fas fa-times";
                }
                else if (boardPoints[i]=="o")
                {
                    icon.className += " far fa-circle";
                }
                cell.appendChild(icon);
                if (lastAdded == i)
                {
                    icon.className+=" fadeIn";
                }
            }
        }
    }

    function nameConfirm() {
        console.log(firstName);
        if (firstName!=null && (firstName.value!="" && secondName.value!=""))
        {
            playerOneName = firstName.value;
            playerSecondName = secondName.value;
            namesDiv.innerHTML = '<input type="submit" value="restart" class="mySubmit" id="restart" onclick="gameBoard.restart()">';
            init();
            render();
        }
        else (playerOneName!="" && playerSecondName!="")
        {
            pageLoad();
            namesDiv.innerHTML = '<input type="submit" value="restart" class="mySubmit" id="restart" onclick="gameBoard.restart()">';
            render();
        }
    }

    function restart()
    {
        init();
        render();
    }

    async function win()
    {
        let name="";
        won=1;
        if (player==1)
        {
            name = playerOneName;
            player=0;
        }
        else {
            name = playerSecondName;
            player=1;
        }
        document.getElementById("restart").setAttribute("onclick", "");
        await sleep(2000);
        document.body.innerHTML = '<div id="container"><div id="header"><span><i class="fas fa-times"></i>Tic-Tac-Toe Game<i class="far fa-circle"></i></span></div><div id="endContainer"><div id="winText">'+name+' won</div><div id="endButtons"><button id="endTryAgain" onclick="gameBoard.nameConfirm()">Retry</button><button id="endNewGame" onclick="gameBoard.pageLoad()">New game</button></div></div></div>';
    }

    async function tie()
    {
        document.getElementById("restart").setAttribute("onclick", "");
        await sleep(2000);
        document.body.innerHTML = '<div id="container"><div id="header"><span><i class="fas fa-times"></i>Tic-Tac-Toe Game<i class="far fa-circle"></i></span></div><div id="endContainer"><div id="winText">'+"Tie"+'</div><div id="endButtons"><button id="endTryAgain" onclick="gameBoard.nameConfirm()">Retry</button><button id="endNewGame" onclick="gameBoard.pageLoad()">New game</button></div></div></div>';
    }

    var checks = (function()
    {
        function winRender(id, x1, x2) 
        {
            let icon = document.getElementById("cell"+id).firstChild;
            icon.className = document.getElementById("cell"+parseInt(id+x1)).firstChild.className;
            icon.className+=" winAnim";
            console.log(document.getElementById("cell"+id));
            icon = document.getElementById("cell"+parseInt(id+x1)).firstChild;
            icon.className+=" winAnim";
            console.log(document.getElementById("cell"+parseInt(id+x1)));
            icon = document.getElementById("cell"+parseInt(id+x2)).firstChild;
            icon.className+=" winAnim";
            console.log(document.getElementById("cell"+parseInt(id+x2)));
            win();
        }

        function verticalAndDiagonalCheck(id) {
            if (id-3<0)
            {
                if ((boardPoints[id]==boardPoints[id+3] && boardPoints[id]==boardPoints[id+6]) || (boardPoints[id] == boardPoints[id+4] && boardPoints[id] == boardPoints[id+8]))
                {
                    if (boardPoints[id]==boardPoints[id+3] && boardPoints[id]==boardPoints[id+6])
                    {
                        winRender(id, 3, 6);
                    }
                    else
                    {
                        winRender(id, 4, 8);
                    }
                }
            }
            else if (id+3>9)
            {
                if ((boardPoints[id]==boardPoints[id-3] && boardPoints[id]==boardPoints[id-6]) || (boardPoints[id] == boardPoints[id-4] && boardPoints[id] == boardPoints[id-8]) || (boardPoints[id]==boardPoints[id-2] && boardPoints[id]==boardPoints[id-4] && id==7))
                {
                    if (boardPoints[id]==boardPoints[id-3] && boardPoints[id]==boardPoints[id-6])
                    {
                        winRender(id, -3, -6);
                    }
                    else if (boardPoints[id] == boardPoints[id-4] && boardPoints[id] == boardPoints[id-8])
                    {
                        winRender(id, -4, -8);
                    }
                    else {
                        winRender(id, -2, -4);
                    }
                }
            }
            else {
                if ((boardPoints[id]==boardPoints[id-3] && boardPoints[id]==boardPoints[id+3]) || (boardPoints[id]==boardPoints[id+4] && boardPoints[id]==boardPoints[id+2] && id<4) || (boardPoints[id] == boardPoints[id-4] && boardPoints[id] == boardPoints[id+4]) || (boardPoints[id]==boardPoints[id-2] && boardPoints[id]==boardPoints[id+2] && id!=4 && id!=6 && id!=3))
                {
                    if (boardPoints[id]==boardPoints[id-3] && boardPoints[id]==boardPoints[id+3])
                    {
                        winRender(id, -3, 3);
                    }
                    else if (boardPoints[id]==boardPoints[id+4] && boardPoints[id]==boardPoints[id+2])
                    {
                        winRender(id, 4, 2);
                    }
                    else if (boardPoints[id] == boardPoints[id-4] && boardPoints[id] == boardPoints[id+4])
                    {
                        winRender(id, -4, 4);
                    }
                    else {
                        winRender(id, -2, 2);
                    }
                }
            }
        }

        function horizontalCheck(id) {
            var first = false;
            for (let i=2; i<9;)
            {
                if (id==i)
                {
                    first=true;
                }
                i += 3;
            }
            if (first)
                {
                    if (boardPoints[id] == boardPoints[id-1] && boardPoints[id] == boardPoints[id+1])
                    {
                        winRender(id, -1, 1);
                    }
                }
                if (id % 3 == 0)
                {
                    if (boardPoints[id] == boardPoints[id-2] && boardPoints[id] == boardPoints[id-1])
                    {
                        winRender(id, -2, -1);
                    }
                }
                else {
                    if (boardPoints[id] == boardPoints[id+1] && boardPoints[id] == boardPoints[id+2] && id!=5)
                    {
                        winRender(id, 1, 2);
                    }
                }
        }

        function tieCheck() {
            let check=true;
            for (let i=1; i<10; i++)
            {
                if (boardPoints[i]!="o" && boardPoints[i]!="x")
                {
                    check=false;
                }
            }
            if (check==true)
            {
                tie();
            }
        }

        return {verticalAndDiagonalCheck, horizontalCheck, tieCheck};
    })();

    function userClick(id) {
        var now = new Date().getTime();
        if (now-lastTime < 250)
        {
            return;
        }
        else
        {
            console.log(id);
            if (boardPoints[id] != "x" && boardPoints[id] != "o")
            {
                console.log(id.innerHTML);
                console.log(player);
                if (player>1 || player==0)
                {
                    boardPoints[id] = "x";
                    player=1;
                }
                else {
                    boardPoints[id] = "o";
                    player=0;
                }
                lastAdded = id;
                checks.verticalAndDiagonalCheck(id);
                checks.horizontalCheck(id);
                if (!won)
                {
                    checks.tieCheck();
                    render();
                }
            }
            lastTime=now;
        }
    }
    pageLoad();
    DOMCache();
    return {userClick, nameConfirm, restart, pageLoad};

})();
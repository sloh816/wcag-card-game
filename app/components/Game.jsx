import Button from "@/components/Button";
import api from "@/lib/api";

const Game = ({ room, playerName }) => {
    const drawCard = () => {
        api.drawCard(room.id, playerName);
    };

    const resetGame = () => {
        api.resetGame(room.id);
    };

    const Hand = ({ player }) => {
        return player.name === playerName ? (
            <ul className="mt-4 flex gap-4 flex-wrap">
                {player.hand.map((card, index) => {
                    return (
                        <li key={index}>
                            <A11yCard card={card} />
                        </li>
                    );
                })}
            </ul>
        ) : (
            <ul className="mt-4 flex gap-4 flex-wrap">
                {player.hand.map((card, index) => {
                    return (
                        <li key={index}>
                            <A11yCard card={card} hide={true} />
                        </li>
                    );
                })}
            </ul>
        );
    };

    const A11yCard = ({ card, hide = false }) => {
        return !hide ? (
            <div className="border border-slate-300 p-4 rounded-lg shadow w-32 h-40">
                <strong>{card.title}</strong>
            </div>
        ) : (
            <div className="border border-slate-300 p-4 rounded-lg shadow w-32 h-40 bg-slate-300"></div>
        );
    };

    const UserCard = ({ card }) => {
        return (
            <div className="flex justify-center items-center mb-8">
                <div className="border border-blue-400 p-4 rounded-lg shadow w-40 h-48">
                    <strong>{card.name}</strong>
                    <p className="text-sm mt-2">{card.description}</p>
                </div>
            </div>
        );
    };

    return (
        <main className="max-w-5xl w-full mx-auto p-4 pt-20">
            <UserCard card={room.game.userCard} />
            <div className="players flex gap-16 justify-between">
                {room.players.map((player) => {
                    return (
                        <div key={player.name}>
                            <p className="text-xl font-bold bg-cyan-200 px-6 py-3 text-center rounded-xl">{player.name}</p>
                            <Hand player={player} />
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 w-32 mx-auto">
                <Button onClickFunc={drawCard} styleType="primary">
                    Draw card
                </Button>
            </div>

            <div className="fixed top-4 left-4">
                <Button onClickFunc={resetGame} styleType="secondary">
                    Reset Game
                </Button>
            </div>
        </main>
    );
};

export default Game;

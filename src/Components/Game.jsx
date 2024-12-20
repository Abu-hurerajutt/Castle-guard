import React, { useState, useEffect, useRef } from "react";
import "./Game.css";

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState(50);
  const [balls, setBalls] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [boss,setboss] = useState([])
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false); // Pause state
  const gameRef = useRef(null);
 const [score,setScore] = useState(0)
  const [backgroundMusic,setbackgroundMusic] = useState()

  const playBgmusic = ()=>{
    const bgElement = document.getElementById("bgmusic")
    bgElement.play()
    setbackgroundMusic("/SFX/background.mp3")
  }
  const playgmmusic=()=>{
    const gmElement = document.getElementById("gmmusic")
    gmElement.play()
  }
  const playshot = () => {
    const shotElement = document.getElementById("gunshot");
    shotElement.play();
  };
  const playHit = () =>{
    const hitElement = document.getElementById("spawnhit")
    hitElement.play()
  }
  const stopbgmusic = ()=>{
    setbackgroundMusic("")
  }
  useEffect(
    ()=>{
      if(paused||gameOver) return;
      const bginterval = setInterval(() => {
        playBgmusic()
      },5 );
      return () => {
        clearInterval(bginterval)
        stopbgmusic()}
    },[paused,gameOver]
  )
  //boss with health
  useEffect(()=>{
    if (paused|| gameOver) return ;
    const bossinterval = setInterval(() => {
      setboss((prev)=>[
        ...prev,{x:5,y:0,health:100}
      ])
    }, 40000);
    return ()=> clearInterval(bossinterval)
  },[paused,gameOver])
  // Spawn enemies with health
  useEffect(() => {
    if (paused || gameOver) return;
    const interval = setInterval(() => {
      setEnemies((prev) => [
        ...prev,
        { x: Math.random() * 90 + 10, y: 0, health: 100 },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [paused, gameOver]);

  // Move balls upwards
  useEffect(() => {
    if (paused || gameOver) return;
    const ballInterval = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls
          .map((ball) => ({ ...ball, y: ball.y + 5 }))
          .filter((ball) => ball.y <= 100)
      );
    }, 50);
    return () => clearInterval(ballInterval);
  }, [paused, gameOver]);

  // Move enemies downwards
  useEffect(() => {
    if (paused || gameOver) return;
    const enemiesInterval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies
          .map((enemy) => ({ ...enemy, y: enemy.y + 2 }))
          .filter((enemy) => enemy.y < 100 )
      );
    }, 100);
    return () => clearInterval(enemiesInterval);
  }, [paused, gameOver]);
  //move boss downward
  useEffect(() => {
    if (paused || gameOver) return;
    const Bossinterval = setInterval(() => {
      setboss((prevboss) =>
        prevboss
          .map((boss) => ({ ...boss, y: boss.y + 2 }))
          .filter((boss) => boss.y < 100)
      );
    }, 1000);
    return () => clearInterval(Bossinterval);
  }, [paused, gameOver]);
  

  // Handle player movement and shooting
  useEffect(() => {
    if (paused || gameOver) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setPlayerPosition((prev) => Math.max(prev - 5, 0));
      }
      if (e.key === "ArrowRight") {
        setPlayerPosition((prev) => Math.min(prev + 5, 90));
      }
      if (e.key === " ") {
        playshot()
        setBalls((prevBalls) => [
          ...prevBalls,
          { x: playerPosition + 5.5, y: 21 },
        ]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {window.removeEventListener("keydown", handleKeyDown)
    };
  }, [playerPosition, paused, gameOver]);
  // check for collisions between balls and boss
  useEffect(()=>{
    if (paused||gameOver) return;
    setboss((prevboss) =>
      prevboss
        .map((boss) => {
          let updatedboss = { ...boss };
          setBalls((prevballs) =>
            prevballs.filter((ball) => {
              if (
                Math.abs(boss.x - ball.x) < 30 &&
                Math.abs(boss.y - ball.y) < 1
              ) {
                updatedboss.health -= 10;
                playHit()
                return false;
              }
              return true;
            })
          );
          if(updatedboss.health > 0){
            return updatedboss;
          } 
          else{
            setScore(a=> score+10)
            return null
          }
        })
        .filter(Boolean)
    );

  },[balls,paused,gameOver])

  // Check for collisions between balls and enemies
  useEffect(() => {
    if (paused || gameOver) return;
    setEnemies((prevEnemies) =>
      prevEnemies
        .map((enemy) => {
          let updatedEnemy = { ...enemy };
          setBalls((prevBalls) =>
            prevBalls.filter((ball) => {
              if (
                Math.abs(enemy.x - ball.x) < 15 &&
                Math.abs(enemy.y - ball.y) < 5
              ) {
                updatedEnemy.health -= 50;
                playHit()
                return false;
              }
              return true;
            })
          );
          if(updatedEnemy.health > 0){
            return updatedEnemy;
          } 
          else{
            setScore(a=> score+1)
            return null
          }
        })
        .filter(Boolean)
    );
  }, [balls, paused, gameOver]);

  // Check if player collides with enemies (game over condition)
  useEffect(() => {
    if (paused || gameOver) return;
    const checkPlayerEnemyCollision = () => {
      setEnemies((prevEnemies) =>
        prevEnemies.filter((enemy) => {
          if (
            Math.abs(enemy.x - playerPosition) < 9 &&
            enemy.y > 89
          ) {
            setGameOver(true);
            playgmmusic()
            return false;
          }
          return true;
        })
      );
    };

    checkPlayerEnemyCollision();
  }, [playerPosition, enemies, paused, gameOver]);

  // Handle restart
  const handleRestart = () => {
    window.location.reload(); // Reload the page
  };

  // Handle resume
  const handleResume = () => {
    setPaused(false);
  };
  //handle clicks on small screens
  const handleclickshoot = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 4.5, y: 17 },
    ]);
  }
  const handleclickright = ()=>{
    setPlayerPosition((prev) => Math.min(prev + 5, 90));
  }
  const handleclickleft = ()=>{
    setPlayerPosition((prev) => Math.max(prev - 5, 0));
  }

  return (
    
    <div ref={gameRef} className="game">
      <button
        className="menu-button"
        onClick={() => setPaused((prev) => !prev)}
      >
        Menu
      </button>
      <br />
      <br />
      <br />
      <input type="number" value={score} readOnly/>

      {paused && !gameOver && (
        <div className="menu">
          <h2>Game Paused</h2>
          <button onClick={handleRestart}>Restart Game</button>
          <button onClick={handleResume}>Resume Game</button>
        </div>
      )}

      {gameOver && <div className="game-over">Game Over
        <button onClick={handleRestart}>Restart</button>
        </div>}

      {!paused && !gameOver && (
        <>
          <div
            className="player"
            style={{ left: `${playerPosition}%` }}
          ></div>
          {balls.map((ball, index) => (
            <div
              key={index}
              className="ball"
              style={{ left: `${ball.x}%`, bottom: `${ball.y}%` }}
            ></div>
          ))}
          <div className="enemiesarea">
          {enemies.map((enemy, index) => (
            <div
              key={index}
              className="enemy"
              style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
            >
<progress
      value={enemy.health}
      max="100"
      style={{ width: "50px", height: "10px" }}
    ></progress>            </div>
          ))}
          {boss.map((boss,index)=>(
            <div
            className="boss"
            key={index}
            style={{left: `${boss.x}%`, top:`${boss.y}%`}}
            >
              <progress
              value={boss.health}
              max="100"
              style={{width:"100px",height:"20px"}}
              ></progress>
            </div>
            
          ))}
         <button onClick={handleclickright}>right</button>
          <button onClick={handleclickleft}>left</button>
          <button onClick={handleclickshoot}>shot</button>
          </div>
          
        </>
      )}
      <audio id="gunshot" src="/SFX/bulletshoot.mp3"></audio>
      <audio id="bgmusic" src={backgroundMusic}></audio>
      <audio id="gmmusic" src="/SFX/gameover.mp3"></audio>
      <audio id="spawnhit" src="/SFX/spawnhit.mp3"></audio>
    </div>
  );
};

export default Game;

import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaCaretSquareLeft } from "react-icons/fa";
import { FaCaretSquareRight } from "react-icons/fa";
import { GiSupersonicBullet } from "react-icons/gi";




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
  const playbosshit = ()=>{
    const bosshitelement= document.getElementById("bosshit")
    bosshitelement.play()
  }
  const stopbgmusic = ()=>{
    setbackgroundMusic("")
  }
  const deadsound = ()=>{
    const deadelement = document.getElementById("dead")
    deadelement.play()
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
        ...prev,{x: Math.random() * 90 + 5,y:0,health:100}
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
        { x: Math.random() * 90 + 5, y: 0, health: 100 },
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
          .filter((enemy) => enemy.y < 100  )
          .filter((enemy) => enemy.x < 90)
      );
    }, 300);
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
          .filter((boss) => boss.x < 90)
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
          { x: playerPosition + 4.3, y: 21 },
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
                Math.abs(boss.x - ball.x) < 20 &&
                Math.abs(boss.y - ball.y) < 1
              ) {
                updatedboss.health -= 5;
                playbosshit()
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
                Math.abs(enemy.x - ball.x) < 10 &&
                Math.abs(enemy.y - ball.y) < 2
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
            deadsound()
            return false;
          }
          return true;
        })
      );
    };

    checkPlayerEnemyCollision();
  }, [playerPosition, enemies, paused, gameOver]);
// check collisions between boss and player
useEffect(() => {
  if (paused || gameOver) return;
  const checkPlayerbossCollision = () => {
    setboss((prevboss) =>
      prevboss.filter((boss) => {
        if (
          Math.abs(boss.x - playerPosition) < 15 &&
          boss.y > 89
        ) {
          setGameOver(true);
          playgmmusic()
          deadsound()
          return false;
        }
        return true;
      })
    );
  };

  checkPlayerbossCollision();
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
  //for nest hub and nest hub max
  const handleclickshoot1 = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 5.6, y: 21 },
    ]);
  }
  //for ipad pro
  const handleclickshoot2 = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 12.6, y: 21 },
    ]);
  }
  //for ipad air
  const handleclickshoot3 = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 14.2, y: 21 },
    ]);
  }
  // for ipad mini and surface pro 7
  const handleclickshoot4 = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 12.4, y: 21 },
    ]);
  }
  // for surface duo 7
  const handleclickshoot5 = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 14, y: 21 },
    ]);
  }
  // for iphone 14 pro max , iphone xr , samsung galaxy a51/71 , iphone 12 promax , iphone se , pixel 7, samsung galazy 8+,samsung s20 ultra,samsung s20 ultra,galaxy zfold
  const handleclickshoot6 = () =>{
    playshot()
    setBalls((prevBalls) => [
      ...prevBalls,
      { x: playerPosition + 15, y: 21 },
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
        <TfiMenuAlt />
      </button>
      <div className="scorebox">Score = {score}</div>

      {paused && !gameOver && (
        <div className="menu">
          <h2>Game Paused</h2>
          <button onClick={handleRestart}>Restart Game</button>
          <br />
          <br />
          <button onClick={handleResume}>Resume Game</button>
        </div>
      )}

      {gameOver && <div className="game-over">Game Over
        <br />
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
      className="spawn-healthbar"
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
              className="boss-hp"
              max="100"
              ></progress>
            </div>
            
          ))}
         <button className=" controlbtn rightbtn" onClick={handleclickright}><FaCaretSquareRight />
         </button>
          <button className="controlbtn leftbtn" onClick={handleclickleft}><FaCaretSquareLeft />
          </button>
          {/* for nest hub and nest hub max */}
          <button className="controlbtn shotbtn shot1" onClick={handleclickshoot1}><GiSupersonicBullet />
          </button>
          {/* for ipad pro */}
          <button className="controlbtn shotbtn shot2" onClick={handleclickshoot2}><GiSupersonicBullet />
          </button>
          {/* for ipad air */}
          <button className="controlbtn shotbtn shot3" onClick={handleclickshoot3}><GiSupersonicBullet />
          </button>
          {/* for ipad mini */}
          <button className="controlbtn shotbtn shot4" onClick={handleclickshoot4}><GiSupersonicBullet />
          </button>
          {/* for asus zenfold */}
          <button className="controlbtn shotbtn shot5" onClick={handleclickshoot5}><GiSupersonicBullet />
          </button>
          {/* for iphone 14 pro max , iphone xr , samsung galaxy a51/71 , iphone 12 promax , iphone se , pixel 7, samsung galazy 8+
          ,galaxy zfold*/}
          <button className="controlbtn shotbtn shot6" onClick={handleclickshoot6}><GiSupersonicBullet />
          </button>
          </div>
          
        </>
      )}
      <audio id="gunshot" src="/SFX/bulletshoot.mp3"></audio>
      <audio id="bgmusic" src={backgroundMusic}></audio>
      <audio id="gmmusic" src="/SFX/gameover.mp3"></audio>
      <audio id="spawnhit" src="/SFX/spawnhit.mp3"></audio>
      <audio id="bosshit" src="/SFX/bosshit.mp3"></audio>
      <audio id="dead" src="/SFX/playerkilled.mp3"></audio>
    </div>
  );
};

export default Game;

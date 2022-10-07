var grid_size = 15;
var grid_bomb_count = grid_size * grid_size / 2;
var grid_to_clear = (grid_size * grid_size) - grid_bomb_count;
var grid_flagged = 0;
var grid_cleared = 0;
var grid_first_click = true;
let grid_first_click_i = Math.floor(Math.random() * (2) + 1);
let grid_first_click_ii = Math.floor(Math.random() * (2) + 1);

var grid = [];
var grid_user = [];
var grid_touching = [];

var grid_html = document.getElementById("grid");
var grid_html_status = document.getElementById("grid_status");
var grid_html_flagged = document.getElementById("grid_flagged");
var grid_html_bombs_total = document.getElementById("grid_bombs_total");
var grid_html_cleared =  document.getElementById("grid_cleared");
var grid_html_to_clear =  document.getElementById("grid_to_clear");

function grid_bomb_add(){
  let bomb_i = Math.floor(Math.random() * (grid_size));
  let bomb_ii = Math.floor(Math.random() * (grid_size));
  if(grid[bomb_i][bomb_ii] == "1"){
    grid_bomb_add();
  } else {
    grid[bomb_i][bomb_ii] = "1";
  }
}

function grid_bomb_touching(){
  let grid_touching_return = [];
  for(x = 0; x < grid_size; x++){
     grid_touching_return.push([]);
     for(xx = 0; xx < grid_size; xx++){
       grid_touching_return[x].push(0);
     }
  }

  for(i = 0; i < grid_size; i++){
    for(ii = 0; ii < grid_size; ii++){
      for(a = i - 1; a <= i + 1; a++){
        for(aa = ii - 1; aa <= ii + 1; aa++){
          if(grid.hasOwnProperty(a)){
            if(grid[a].hasOwnProperty(aa)){
              if(grid[i][ii] == "1"){
                grid_touching_return[i][ii] = "b";
              }
              if(grid[a][aa] == "1" && grid_touching_return[i][ii] != "b"){
                grid_touching_return[i][ii] = grid_touching_return[i][ii] + 1;
              }
            }
          }
        }
      }
    }
  } 
  return grid_touching_return;
}

function bomb_flood_fill(bomb_i, bomb_ii){
  bomb_i = parseInt(bomb_i);
  bomb_ii = parseInt(bomb_ii);
  if((bomb_i >= grid_size) ||
     (bomb_i < 0) ||
     (bomb_ii >= grid_size) ||
     (bomb_ii < 0) ||
     (grid_user[bomb_i][bomb_ii] == "2") ||
     (grid_user[bomb_i][bomb_ii] == "1") ||
     (grid_touching[bomb_i][bomb_ii] == "b")){ 
    return false;
  }
  
  grid_user[bomb_i][bomb_ii] = "2";
  let bomb_button = document.getElementById("bomb-"+bomb_i+"-"+bomb_ii);
  bomb_button.classList = "field";
  bomb_button.classList.add("checked");
  if(grid_touching[bomb_i][bomb_ii] != 0){
    bomb_button.innerHTML = grid_touching[bomb_i][bomb_ii];
  }
  bomb_button.disabled = true;
  grid_cleared++;
  grid_html_cleared.innerHTML = grid_cleared;
  
  bomb_flood_fill(bomb_i+1, bomb_ii);
  bomb_flood_fill(bomb_i-1, bomb_ii);
  bomb_flood_fill(bomb_i, bomb_ii+1);
  bomb_flood_fill(bomb_i, bomb_ii-1);
  
  bomb_flood_fill(bomb_i-1, bomb_ii-1);
  bomb_flood_fill(bomb_i+1, bomb_ii+1);
}

function grid_bomb_event(bomb_button, bomb_event){
  let bomb_pos = bomb_button.id.split("-");
  let bomb_i = parseInt(bomb_pos[1]);
  let bomb_ii = parseInt(bomb_pos[2]);
  
  if(bomb_event == "check"){
    if(grid_first_click){
      for(a = bomb_i - grid_first_click_i; a <= bomb_i + grid_first_click_i; a++){
        for(aa = bomb_ii - grid_first_click_ii; aa <= bomb_ii + grid_first_click_ii; aa++){
          if(grid.hasOwnProperty(a)){
            if(grid[a].hasOwnProperty(aa)){
              grid[a][aa] = "2";
            }
          }
        }
      }
      grid_touching = grid_bomb_touching();
      grid_first_click = false;
    }
    if(grid[bomb_i][bomb_ii] == "1"){
      console.log("GAME OVER");
      grid_status.innerHTML = "Game Over";
      grid_status.classList.add("red");
      bomb_button.classList = "field";
      bomb_button.classList.add("bomb");
      grid_bomb_button_handlers_clear();
      return false;
    } else if(grid[bomb_i][bomb_ii] != "1" && grid_user[bomb_i][bomb_ii] != "2") {
        let bomb_button_touching = parseInt(grid_touching[bomb_i][bomb_ii]);
        if(bomb_button_touching == 0){
          bomb_flood_fill(bomb_i, bomb_ii);
        } else {
          bomb_button.innerHTML = bomb_button_touching; 
          grid_user[bomb_i][bomb_ii] = "2";
          bomb_button.classList = "field";
          bomb_button.classList.add("checked");
          bomb_button.disabled = true;
          grid_cleared++;
          grid_html_cleared.innerHTML = grid_cleared;
        }
      }
  }else if (bomb_event == "flag"){
    if(grid_user[bomb_i][bomb_ii] == "1"){
      bomb_button.classList = "field";
      grid_user[bomb_i][bomb_ii] = [];
      grid_flagged--;
      grid_html_flagged.innerHTML = grid_flagged;
      console.log("unflag");
    }else{
      bomb_button.classList = "field";
      bomb_button.classList.add("flag");
      grid_user[bomb_i][bomb_ii] = "1";
      grid_flagged++;
      grid_html_flagged.innerHTML = grid_flagged;
    }
  }
  console.log(bomb_event, bomb_i, bomb_ii);
  if(JSON.stringify(grid)==JSON.stringify(grid_user)){
    grid_status.innerHTML = "Game Complete";
    grid_status.classList.add("green");
    grid_bomb_button_handlers_clear();
  }
}

function grid_bomb_button_handlers(){
  for(i = 0; i < grid_size; i++){
    for(ii = 0; ii < grid_size; ii++){
      let grid_bomb_temp = document.getElementById("bomb-"+i+"-"+ii);
      grid_bomb_temp.addEventListener("click", function(){
        grid_bomb_event(grid_bomb_temp, "check");
      });
      grid_bomb_temp.addEventListener("contextmenu", function(){
        grid_bomb_event(grid_bomb_temp, "flag");
      });
    }
  }
}
function grid_bomb_button_handlers_clear(){
  for(i = 0; i < grid_size; i++){
    for(ii = 0; ii < grid_size; ii++){
      let grid_bomb_temp = document.getElementById("bomb-"+i+"-"+ii);
      grid_bomb_temp.disabled = true;
    }
  }
}
function grid_setup(){
  grid_html_flagged.innerHTML = grid_flagged;
  grid_html_bombs_total.innerHTML = grid_bomb_count;
  grid_html_cleared.innerHTML = grid_cleared;
  grid_html_to_clear.innerHTML = grid_to_clear;
  console.log("[setup] =============== restart ===============");
  // Setup blank grid
  for(i = 0; i < grid_size; i++){
    grid.push([]);
    grid_user.push([]);
    for(ii = 0; ii < grid_size; ii++){
      grid[i].push("2");
      grid_user[i].push("0");
    }
  }
  console.log("[setup] grids");
  
  // Add bombs
  for(i = 0; i < grid_bomb_count; i++){
    grid_bomb_add();
  }
  console.log("[setup] bombs");
  
  // Output
  let grid_html_temp = "";
  for(i = 0; i < grid_size; i++){
    grid_html_temp += "<div class='row'>";
    for(ii = 0; ii < grid_size; ii++){
      grid_html_temp += "<button id='bomb-"+i+"-"+ii+"' class='field'>";
      //if(grid[i][ii] == "1"){
        //grid_html_temp += "b";
      //}
      grid_html_temp += "</button>";
    }
    grid_html_temp += "</div>";
  }
  grid_html.innerHTML = grid_html_temp;
  grid_html.oncontextmenu = function() {
    return false;
  }
  console.log("[setup] output");
  
  grid_bomb_button_handlers();
  console.log("[setup] button handlers");
}

grid_setup(10);

console.log(grid_touching);
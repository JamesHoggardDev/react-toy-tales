import React from 'react';
import './App.css';

import Header from './components/Header'
import ToyForm from './components/ToyForm'
import ToyContainer from './components/ToyContainer'
const toysUrl = 'http://localhost:3000/toys'


class App extends React.Component{

  state = {
    display: false,
    toys: []
  }

  componentDidMount(){
    fetch(toysUrl)
    .then(res => res.json())
    .then(toys => this.setState({toys}));
  }

  handleClick = () => {
    let newBoolean = !this.state.display
    this.setState({
      display: newBoolean
    })
  }

  handleLike = toy => {
    toy.likes++
    fetch(`http://localhost:3000/toys/${toy.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(toy),
		})
			.then(res => res.json())
			.then(updatedToy => {
        let toys = this.state.toys.map(toy => {
          return toy.id === updatedToy.id ? updatedToy : toy
        });
        this.setState({toys});
      });
  };
  handleDonate = donatedToy => {
    let toys = this.state.toys.filter(toy => toy.id !== donatedToy.id)
    this.setState({toys}) 
    fetch(`http://localhost:3000/toys/${donatedToy.id}`, {
			method: 'DELETE',
		})
    .then(console.log)
  }

  addToy = toy => {
    
    fetch(toysUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toy)
    })
    .then(res => res.json())
    .then(newToy => {
      let toys = [...this.state.toys, newToy]
      this.setState({toys})
      this.handleClick()
    })
  }


  render(){
    return (
      <>
        <Header/>
        { this.state.display
            ?
            <ToyForm addToy={this.addToy}/>
            :
          null
        }
        <div className="buttonContainer">
          <button onClick={this.handleClick}> Add a Toy </button>
        </div>
        <ToyContainer 
        toys={this.state.toys} 
        handleLike={this.handleLike} 
        handleDonate={this.handleDonate} />
      </>
    );
  }

}

export default App;

import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null,
          title:'',
          completed:false,
        },
        editing:false,
      }
      this.fetchDuties = this.fetchDuties.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount(){
    this.fetchDuties()
  }

  fetchDuties(){
    console.log('Fetching...')

    fetch('http://127.0.0.1:8000/api/duty-list')
    .then(response => response.json())
    .then(data =>
      this.setState({
        todoList:data
      })
      )
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/api/duty-create/'

    if(this.state.editing == true){
      url = `http://127.0.0.1:8000/api/duty-update/${ this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }



    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)  => {
        this.fetchDuties()
        this.setState({
           activeItem:{
          id:null,
          title:'',
          completed:false,
        }
        })
    }).catch(function(error){
      console.log('ERROR:', error)
    })

  }

  startEdit(duty){
    this.setState({
      activeItem:duty,
      editing:true,
    })
  }


  deleteItem(duty){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/api/duty-delete/${duty.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{

      this.fetchDuties()
    })
  }


  strikeUnstrike(duty){

    duty.completed = !duty.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/api/duty-update/${duty.id}/`

      fetch(url, {
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'completed': duty.completed, 'title':duty.title})
      }).then(() => {
        this.fetchDuties()
      })

    console.log('DUTY:', duty.completed)
  }


  render(){

    var duties = this.state.todoList
    var self = this
      

    return(
        <div className="container">
          <div id="duty-container">
              <div  id="form-wrapper">
                 <form onSubmit={this.handleSubmit}  id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add duty.." />
                         </div>

                         <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
                </form>

              </div>

              <div  id="list-wrapper">
                    {duties.map(function(duty, index){
                      return(
                          <div key={index} className="duty-wrapper flex-wrapper">

                            <div onClick={() => self.strikeUnstrike(duty)} style={{flex:7}}>

                                {duty.completed == false ? (
                                    <span>{duty.title}</span>

                                  ) : (

                                    <strike>{duty.title}</strike>
                                  )}
                            </div>
                            <div style={{flex:1}}>
                                <button onClick={() => self.startEdit(duty)} className="btn btn-sm btn-outline-info">Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.deleteItem(duty)} className="btn btn-sm btn-outline-dark delete">Delete</button>
                            </div>

                          </div>
                        )
                    })}
              </div>
          </div>

        </div>
      )
  }
}



export default App;
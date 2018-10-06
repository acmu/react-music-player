import React from 'react';
import './musicListItem.less';
import Pubsub from 'pubsub-js';

let MusicListItem = React.createClass({
  playMusic(musicItem) {
    Pubsub.publish('PLAY_MUSIC', musicItem);
  },
  deleteMusic(musicItem, e) {
    // e是dom事件，防止冒泡导致li也click
    e.stopPropagation();
    Pubsub.publish('DELETE_MUSIC', musicItem);
  },
  render() {
    let musicItem = this.props.musicItem;
    return (
      // onClick的值是一个句柄，而不是一个可执行的函数，所以用bind传参
      <li onClick={this.playMusic.bind(this, musicItem)} className={`components-listitem row ${this.props.focus?'focus':''}`} >
        <p><strong>{ musicItem.title }</strong> - { musicItem.artist }</p>
        <p onClick={this.deleteMusic.bind(this, musicItem)} className="-col-auto delete"></p>
      </li>
    )
  }
});

export default MusicListItem;

import React from 'react';
import Header from './components/header';
import Player from './pages/player';
import MusicList from './pages/musicList';
import Pubsub from 'pubsub-js';
import { MUSIC_LIST } from './config/config';
import { Router, IndexRoute, Route, Link, hashHistory } from 'react-router';

let App = React.createClass({
  // 初始化内部数据
  getInitialState() {
    return {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[4]
    }
  },
  playMusic(musicItem) {
    $('#player').jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');

    this.setState({
      currentMusicItem: musicItem
    });
  },
  playNext(type = 'next') {
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let musicListLength = this.state.musicList.length;
    index += musicListLength;
    let newIndex = (type === 'next' ? (index + 1) : (index - 1)) % musicListLength;
    
    this.playMusic(this.state.musicList[newIndex]);
  },
  findMusicIndex(musicItem) {
    return this.state.musicList.indexOf(musicItem);
  },
  // DOM已经挂载完成
  componentDidMount() {
    // jplayer配置
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    });
    // this.playMusic(this.state.currentMusicItem);
    // 结束之后下一曲
    $('#player').bind($.jPlayer.event.ended, () => {
      this.playNext();
    })
    // 订阅器
    Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
      this.playMusic(musicItem);
    });
    Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
      this.setState({
        musicList: this.state.musicList.filter((item) => {
          return item !== musicItem;
        })
      });
    });

    Pubsub.subscribe('PLAY_NEXT', () => {
      this.playNext();
    });
    Pubsub.subscribe('PLAY_PREV', () => {
      this.playNext('prev');
    });
  },
  componentWillUnmount() {
    // 有事件绑定，就要解绑
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('DELETE_MUSIC');
    Pubsub.unsubscribe('PLAY_NEXT');
    Pubsub.unsubscribe('PLAY_PREV');
    $('#player').unbind($.jPlayer.event.ended)
  },
  render() {
    return (
      <div className="root">
        <Header></Header>
        {React.cloneElement(this.props.children, this.state)}
      </div>
    );
  }
});

let Root = React.createClass({
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Player}></IndexRoute>
          <Route path="/list" component={MusicList}></Route>
        </Route>
      </Router>
    );
  }
});

export default Root;

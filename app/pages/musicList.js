import React from 'react';
import MusicListItem from '../components/musicListItem';

let MusicList = React.createClass({
  render() {
    let listEle = null;
    // 用map原因：map会返回一个新数组，不会对原来的数组产生影响
    // 当props传过来的是数组或对象时，存的是引用，所以不要修改他们
    listEle = this.props.musicList.map((item) => {
      return (
        <MusicListItem
          focus={ this.props.currentMusicItem === item }
          key={ item.id }
          musicItem={ item }
        >
          { item.title }
        </MusicListItem>
      );
    });
    return (
      <ul>
        { listEle }
      </ul>
    );
  }
});

export default MusicList;

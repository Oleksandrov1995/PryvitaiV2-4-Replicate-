import React, { useRef, useEffect } from 'react';
import Editor from '../../components/Editor/Editor';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';


const EditorPage = () => {

    return (
      <div>
        <Header/>
        <Editor/>
        <Footer/>
        </div>
  );
};

export default EditorPage;


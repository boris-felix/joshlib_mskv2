

===============================================
J.Tree (class)
===============================================
The state tree

.. contents::
   :local:

.. class:: J.Tree (app)


.. ============================== class summary ==========================
  



  The state tree

.. ============================== properties summary =====================



.. ============================== methods summary ========================


  

..
  
    
       
       .. method:: compactMoves(moves)

         Removes useless move sequences like ['up','down']
    
       
       .. method:: getBaseName(path)

         Returns the final component of a pathname
    
       
       .. method:: getData(path)

         Gets the data at some path in the tree
    
       
       .. method:: getDirName(path)

         Returns the directory component of a pathname
    
       
       .. method:: getState(register)

         Get the value in a state register
    
       
       .. method:: isDirectory(path)

         Tests if a path is a directory
    
       
       .. method:: preloadAll()

         Preloads all tree data
    
       
       .. method:: resolveMoves(path, moves, callback)

         Apply a move sequence to a path and get the result path
    
       
       .. method:: setData(path, data)

         Assigns data to a path in the tree
    
       
       .. method:: setState(register, state)

         Set a state register to a value
    
  
        
        
      

.. ============================== events summary ========================


      

.. ============================== constructor details ====================

Constructor details
===================

      
        
        

..        J.Tree(app)
        
        .. container:: description

            
            
            
        
            


          
            <dl class="detailList">
            <dt class="heading">Parameters:</dt>
            
              <dt>
                <span class="light fixedFont">{<a href="../symbols/J.App.rst">J.App</a>}</span>  <b>app</b>
                
              </dt>
                <dd>Reference to the app object</dd>
            
            </dl>
          
          
          
          
          
          
          

      

.. ============================== field details ==========================

Field details
=============

      

.. ============================== method details =========================

Method details
==============

..
      
        
          <a name="compactMoves"> </a>
          <div class="fixedFont">
          
          <span class="light">{Array}</span>
          <b>compactMoves</b>(moves)
          </div>

..
          <div class="description">
            Removes useless move sequences like ['up','down']
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{Array}</span> <b>moves</b>
                  
                </dt>
                <dd>An array of moves</dd>
              
              </dl>
            

            

            

            

            
..
              Returns:
              
                * {Array} Array A possibly smaller array of moves
              
            

            

..
            

..
          <hr />
        
          <a name="getBaseName"> </a>
          <div class="fixedFont">
          
          <span class="light">{String}</span>
          <b>getBaseName</b>(path)
          </div>

..
          <div class="description">
            Returns the final component of a pathname
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>path</b>
                  
                </dt>
                <dd>The path</dd>
              
              </dl>
            

            

            

            

            
..
              Returns:
              
                * {String} Final component
              
            

            

..
            

..
          <hr />
        
          <a name="getData"> </a>
          <div class="fixedFont">
          
          
          <b>getData</b>(path)
          </div>

..
          <div class="description">
            Gets the data at some path in the tree
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>path</b>
                  
                </dt>
                <dd>The path</dd>
              
              </dl>
            

            

            

            

            
..
              Returns:
              
                * Tree data
              
            

            

..
            

..
          <hr />
        
          <a name="getDirName"> </a>
          <div class="fixedFont">
          
          <span class="light">{String}</span>
          <b>getDirName</b>(path)
          </div>

..
          <div class="description">
            Returns the directory component of a pathname
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>path</b>
                  
                </dt>
                <dd>The path</dd>
              
              </dl>
            

            

            

            

            
..
              Returns:
              
                * {String} Directory name
              
            

            

..
            

..
          <hr />
        
          <a name="getState"> </a>
          <div class="fixedFont">
          
          
          <b>getState</b>(register)
          </div>

..
          <div class="description">
            Get the value in a state register
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>register</b>
                  
                </dt>
                <dd>A named state register</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="isDirectory"> </a>
          <div class="fixedFont">
          
          <span class="light">{Boolean}</span>
          <b>isDirectory</b>(path)
          </div>

..
          <div class="description">
            Tests if a path is a directory
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>path</b>
                  
                </dt>
                <dd>The path</dd>
              
              </dl>
            

            

            

            

            
..
              Returns:
              
                * {Boolean} Wheter the path is a directory
              
            

            

..
            

..
          <hr />
        
          <a name="preloadAll"> </a>
          <div class="fixedFont">
          
          
          <b>preloadAll</b>()
          </div>

..
          <div class="description">
            Preloads all tree data
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="resolveMoves"> </a>
          <div class="fixedFont">
          
          
          <b>resolveMoves</b>(path, moves, callback)
          </div>

..
          <div class="description">
            Apply a move sequence to a path and get the result path
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>path</b>
                  
                </dt>
                <dd>The starting path</dd>
              
                <dt>
                  <span class="light fixedFont">{Array}</span> <b>moves</b>
                  
                </dt>
                <dd>An array of moves</dd>
              
                <dt>
                  <span class="light fixedFont">{Function}</span> <b>callback</b>
                  
                </dt>
                <dd>A callback for the end path</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setData"> </a>
          <div class="fixedFont">
          
          
          <b>setData</b>(path, data)
          </div>

..
          <div class="description">
            Assigns data to a path in the tree
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>path</b>
                  
                </dt>
                <dd>The path</dd>
              
                <dt>
                  <b>data</b>
                  
                </dt>
                <dd>The tree data</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setState"> </a>
          <div class="fixedFont">
          
          
          <b>setState</b>(register, state)
          </div>

..
          <div class="description">
            Set a state register to a value
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>register</b>
                  
                </dt>
                <dd>A named state register</dd>
              
                <dt>
                  <b>state</b>
                  
                </dt>
                <dd>The state value</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          
        
      
      
.. ============================== event details =========================



.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 on Thu Feb 10 2011 20:45:24 GMT+0100 (CET)

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/




.. vim: set ft=rst :

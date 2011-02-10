

===============================================
J.UIElement (class)
===============================================
An abstract UI Element

.. contents::
   :local:

.. class:: J.UIElement (app, id, options)


.. ============================== class summary ==========================
  



  An abstract UI Element

.. ============================== properties summary =====================



.. ============================== methods summary ========================


  

..
  
    
       
       .. method:: event(eventname)

         Calls a custom event handler
    
       
       .. method:: getHtmlId()

         Gets the actual DOM ElementId of the UIElement
    
       
       .. method:: hide()

         Hide the element right away
    
       
       .. method:: hideDelayed()

         Hide the element, possibly with a delay
    
       
       .. method:: insert()

         Insert the element in the DOM
    
       
       .. method:: onBlur()

         onBlur
    
       
       .. method:: onFocus(treePath)

         onFocus
    
       
       .. method:: refresh(callback)

         Refresh data in the UIElement
    
       
       .. method:: registerChild(elt)

         Registers one element as a child
    
       
       .. method:: setData(data)

         Sets the data for the UIElement
    
       
       .. method:: setLoading()

         Puts the element in loading mode
    
       
       .. method:: setTreeCurrent(treeCurrent)

         Sets the current tree path associated with the element
    
       
       .. method:: setTreeRoot(treeRoot)

         Sets the tree root associated with the element
    
       
       .. method:: show()

         Show the element right away
    
       
       .. method:: showDelayed()

         Show the element, possibly with a delay
    
       
       .. method:: subscribes()

         Get the list of subscribed events when the element has focus
    
  
        
        
      

.. ============================== events summary ========================


      

.. ============================== constructor details ====================

Constructor details
===================

      
        
        

..        J.UIElement(app, id, options)
        
        .. container:: description

            
            
            
        
            


          
            <dl class="detailList">
            <dt class="heading">Parameters:</dt>
            
              <dt>
                <span class="light fixedFont">{<a href="../symbols/J.App.rst">J.App</a>}</span>  <b>app</b>
                
              </dt>
                <dd>Reference to the app object</dd>
            
              <dt>
                <span class="light fixedFont">{String}</span>  <b>id</b>
                
              </dt>
                <dd>unique identifier</dd>
            
              <dt>
                 <b>options</b>
                
              </dt>
                <dd></dd>
            
            </dl>
          
          
          
          
          
          
          

      

.. ============================== field details ==========================

Field details
=============

      

.. ============================== method details =========================

Method details
==============

..
      
        
          <a name="event"> </a>
          <div class="fixedFont">
          
          
          <b>event</b>(eventname)
          </div>

..
          <div class="description">
            Calls a custom event handler
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>eventname</b>
                  
                </dt>
                <dd>Name of the event</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="getHtmlId"> </a>
          <div class="fixedFont">
          
          <span class="light">{String}</span>
          <b>getHtmlId</b>()
          </div>

..
          <div class="description">
            Gets the actual DOM ElementId of the UIElement
            
            
          </div>



            

            

            

            

            
..
              Returns:
              
                * {String} ElementId
              
            

            

..
            

..
          <hr />
        
          <a name="hide"> </a>
          <div class="fixedFont">
          
          
          <b>hide</b>()
          </div>

..
          <div class="description">
            Hide the element right away
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="hideDelayed"> </a>
          <div class="fixedFont">
          
          
          <b>hideDelayed</b>()
          </div>

..
          <div class="description">
            Hide the element, possibly with a delay
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="insert"> </a>
          <div class="fixedFont">
          
          
          <b>insert</b>()
          </div>

..
          <div class="description">
            Insert the element in the DOM
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="onBlur"> </a>
          <div class="fixedFont">
          
          
          <b>onBlur</b>()
          </div>

..
          <div class="description">
            onBlur
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="onFocus"> </a>
          <div class="fixedFont">
          
          
          <b>onFocus</b>(treePath)
          </div>

..
          <div class="description">
            onFocus
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>treePath</b>
                  
                </dt>
                <dd>Path of the focused element in the tree</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="refresh"> </a>
          <div class="fixedFont">
          
          
          <b>refresh</b>(callback)
          </div>

..
          <div class="description">
            Refresh data in the UIElement
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{Function}</span> <b>callback</b>
                  
                </dt>
                <dd>callback when refreshed</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="registerChild"> </a>
          <div class="fixedFont">
          
          
          <b>registerChild</b>(elt)
          </div>

..
          <div class="description">
            Registers one element as a child
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{<a href="../symbols/J.UIElement.rst">J.UIElement</a>}</span> <b>elt</b>
                  
                </dt>
                <dd>The child element</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setData"> </a>
          <div class="fixedFont">
          
          
          <b>setData</b>(data)
          </div>

..
          <div class="description">
            Sets the data for the UIElement
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <b>data</b>
                  
                </dt>
                <dd>Data</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setLoading"> </a>
          <div class="fixedFont">
          
          
          <b>setLoading</b>()
          </div>

..
          <div class="description">
            Puts the element in loading mode
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setTreeCurrent"> </a>
          <div class="fixedFont">
          
          
          <b>setTreeCurrent</b>(treeCurrent)
          </div>

..
          <div class="description">
            Sets the current tree path associated with the element
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>treeCurrent</b>
                  
                </dt>
                <dd>Tree path</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setTreeRoot"> </a>
          <div class="fixedFont">
          
          
          <b>setTreeRoot</b>(treeRoot)
          </div>

..
          <div class="description">
            Sets the tree root associated with the element
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>treeRoot</b>
                  
                </dt>
                <dd>Tree path</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="show"> </a>
          <div class="fixedFont">
          
          
          <b>show</b>()
          </div>

..
          <div class="description">
            Show the element right away
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="showDelayed"> </a>
          <div class="fixedFont">
          
          
          <b>showDelayed</b>()
          </div>

..
          <div class="description">
            Show the element, possibly with a delay
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="subscribes"> </a>
          <div class="fixedFont">
          
          <span class="light">{Array}</span>
          <b>subscribes</b>()
          </div>

..
          <div class="description">
            Get the list of subscribed events when the element has focus
            
            
          </div>



            

            

            

            

            
..
              Returns:
              
                * {Array} list of events
              
            

            

..
            

..
          
        
      
      
.. ============================== event details =========================



.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 on Thu Feb 10 2011 20:45:24 GMT+0100 (CET)

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/




.. vim: set ft=rst :

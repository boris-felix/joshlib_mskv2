

===============================================
J.App (class)
===============================================
The base application class

.. contents::
   :local:

.. class:: J.App (appId)


.. ============================== class summary ==========================
  



  The base application class

.. ============================== properties summary =====================



.. ============================== methods summary ========================


  

..
  
    
       
       .. method:: insert()

         Inserts the app in the DOM
    
       
       .. method:: publish(message, data, sync)

         Send an event.
    
       
       .. method:: setBaseHtmlId(eltId)

         Sets the DOM base element of the app
    
       
       .. method:: setBaseUIElement(elt)

         Sets the base UI element of the app
    
       
       .. method:: setup(callback)

         Setups the app.
    
       
       .. method:: subscribe(message, func)

         Subscribes the passed function to the passed message.
    
       
       .. method:: unsubscribe(token)

         Unsubscribes a specific subscriber from a specific message using the unique token
    
  
        
        
      

.. ============================== events summary ========================


      

.. ============================== constructor details ====================

Constructor details
===================

      
        
        

..        J.App(appId)
        
        .. container:: description

            
            
            
        
            


          
            <dl class="detailList">
            <dt class="heading">Parameters:</dt>
            
              <dt>
                <span class="light fixedFont">{String}</span>  <b>appId</b>
                
              </dt>
                <dd>Unique identifier for the app</dd>
            
            </dl>
          
          
          
          
          
          
          

      

.. ============================== field details ==========================

Field details
=============

      

.. ============================== method details =========================

Method details
==============

..
      
        
          <a name="insert"> </a>
          <div class="fixedFont">
          
          
          <b>insert</b>()
          </div>

..
          <div class="description">
            Inserts the app in the DOM
            
            
          </div>



            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="publish"> </a>
          <div class="fixedFont">
          
          
          <b>publish</b>(message, data, sync)
          </div>

..
          <div class="description">
            Send an event. Publishes the the message, passing the data to its subscribers
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>message</b>
                  
                </dt>
                <dd>The message to publish</dd>
              
                <dt>
                  <b>data</b>
                  
                </dt>
                <dd>The data to pass to subscribers</dd>
              
                <dt>
                  <span class="light fixedFont">{Boolean}</span> <b>sync</b>
                  
                </dt>
                <dd>Forces publication to be syncronous, which is more confusing, but faster</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setBaseHtmlId"> </a>
          <div class="fixedFont">
          
          
          <b>setBaseHtmlId</b>(eltId)
          </div>

..
          <div class="description">
            Sets the DOM base element of the app
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>eltId</b>
                  
                </dt>
                <dd>ElementID of the base HTML container element</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setBaseUIElement"> </a>
          <div class="fixedFont">
          
          
          <b>setBaseUIElement</b>(elt)
          </div>

..
          <div class="description">
            Sets the base UI element of the app
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{<a href="../symbols/J.UIElement.rst">J.UIElement</a>}</span> <b>elt</b>
                  
                </dt>
                <dd>Base UI Element (Container for all others)</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="setup"> </a>
          <div class="fixedFont">
          
          
          <b>setup</b>(callback)
          </div>

..
          <div class="description">
            Setups the app. Overload with app-specific init code
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{Function}</span> <b>callback</b>
                  
                </dt>
                <dd>to call when finished</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          <hr />
        
          <a name="subscribe"> </a>
          <div class="fixedFont">
          
          <span class="light">{String}</span>
          <b>subscribe</b>(message, func)
          </div>

..
          <div class="description">
            Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>message</b>
                  
                </dt>
                <dd>The message to subscribe to</dd>
              
                <dt>
                  <span class="light fixedFont">{Function}</span> <b>func</b>
                  
                </dt>
                <dd>The function to call when a new message is published</dd>
              
              </dl>
            

            

            

            

            
..
              Returns:
              
                * {String} token for unsubscribing
              
            

            

..
            

..
          <hr />
        
          <a name="unsubscribe"> </a>
          <div class="fixedFont">
          
          
          <b>unsubscribe</b>(token)
          </div>

..
          <div class="description">
            Unsubscribes a specific subscriber from a specific message using the unique token
            
            
          </div>



            
..
              <dl class="detailList">
              <dt class="heading">Parameters:</dt>
              
                <dt>
                  <span class="light fixedFont">{String}</span> <b>token</b>
                  
                </dt>
                <dd>The token of the function to unsubscribe</dd>
              
              </dl>
            

            

            

            

            

            

..
            

..
          
        
      
      
.. ============================== event details =========================



.. container:: footer

   Documentation generated by jsdoc-toolkit_  2.4.0 on Thu Feb 10 2011 20:45:23 GMT+0100 (CET)

.. _jsdoc-toolkit: http://code.google.com/p/jsdoc-toolkit/




.. vim: set ft=rst :

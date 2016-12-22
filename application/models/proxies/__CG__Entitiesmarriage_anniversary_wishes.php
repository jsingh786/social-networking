<?php

namespace Proxies\__CG__\Entities;

/**
 * THIS CLASS WAS GENERATED BY THE DOCTRINE ORM. DO NOT EDIT THIS FILE.
 */
class marriage_anniversary_wishes extends \Entities\marriage_anniversary_wishes implements \Doctrine\ORM\Proxy\Proxy
{
    private $_entityPersister;
    private $_identifier;
    public $__isInitialized__ = false;
    public function __construct($entityPersister, $identifier)
    {
        $this->_entityPersister = $entityPersister;
        $this->_identifier = $identifier;
    }
    /** @private */
    public function __load()
    {
        if (!$this->__isInitialized__ && $this->_entityPersister) {
            $this->__isInitialized__ = true;

            if (method_exists($this, "__wakeup")) {
                // call this after __isInitialized__to avoid infinite recursion
                // but before loading to emulate what ClassMetadata::newInstance()
                // provides.
                $this->__wakeup();
            }

            if ($this->_entityPersister->load($this->_identifier, $this) === null) {
                throw new \Doctrine\ORM\EntityNotFoundException();
            }
            unset($this->_entityPersister, $this->_identifier);
        }
    }

    /** @private */
    public function __isInitialized()
    {
        return $this->__isInitialized__;
    }

    
    public function getId()
    {
        if ($this->__isInitialized__ === false) {
            return (int) $this->_identifier["id"];
        }
        $this->__load();
        return parent::getId();
    }

    public function setId($id)
    {
        $this->__load();
        return parent::setId($id);
    }

    public function getDuration_to_display()
    {
        $this->__load();
        return parent::getDuration_to_display();
    }

    public function setDuration_to_display($duration_to_display)
    {
        $this->__load();
        return parent::setDuration_to_display($duration_to_display);
    }

    public function getUnderlying_text()
    {
        $this->__load();
        return parent::getUnderlying_text();
    }

    public function setUnderlying_text($underlying_text)
    {
        $this->__load();
        return parent::setUnderlying_text($underlying_text);
    }

    public function getCreated_at()
    {
        $this->__load();
        return parent::getCreated_at();
    }

    public function setCreated_at($created_at)
    {
        $this->__load();
        return parent::setCreated_at($created_at);
    }

    public function getIlookUser()
    {
        $this->__load();
        return parent::getIlookUser();
    }

    public function setIlookUser($ilookUser)
    {
        $this->__load();
        return parent::setIlookUser($ilookUser);
    }

    public function getWallPost()
    {
        $this->__load();
        return parent::getWallPost();
    }

    public function setWallPost($wallPost)
    {
        $this->__load();
        return parent::setWallPost($wallPost);
    }


    public function __sleep()
    {
        return array('__isInitialized__', 'id', 'duration_to_display', 'underlying_text', 'created_at', 'ilookUser', 'wallPost');
    }

    public function __clone()
    {
        if (!$this->__isInitialized__ && $this->_entityPersister) {
            $this->__isInitialized__ = true;
            $class = $this->_entityPersister->getClassMetadata();
            $original = $this->_entityPersister->load($this->_identifier);
            if ($original === null) {
                throw new \Doctrine\ORM\EntityNotFoundException();
            }
            foreach ($class->reflFields as $field => $reflProperty) {
                $reflProperty->setValue($this, $reflProperty->getValue($original));
            }
            unset($this->_entityPersister, $this->_identifier);
        }
        
    }
}
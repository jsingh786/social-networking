<?php

namespace Proxies\__CG__\Entities;

/**
 * THIS CLASS WAS GENERATED BY THE DOCTRINE ORM. DO NOT EDIT THIS FILE.
 */
class login_summary extends \Entities\login_summary implements \Doctrine\ORM\Proxy\Proxy
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

    public function getLogin_time()
    {
        $this->__load();
        return parent::getLogin_time();
    }

    public function setLogin_time($login_time)
    {
        $this->__load();
        return parent::setLogin_time($login_time);
    }

    public function getLogout_time()
    {
        $this->__load();
        return parent::getLogout_time();
    }

    public function setLogout_time($logout_time)
    {
        $this->__load();
        return parent::setLogout_time($logout_time);
    }

    public function getLogin_ip()
    {
        $this->__load();
        return parent::getLogin_ip();
    }

    public function setLogin_ip($login_ip)
    {
        $this->__load();
        return parent::setLogin_ip($login_ip);
    }

    public function getCountry()
    {
        $this->__load();
        return parent::getCountry();
    }

    public function setCountry($country)
    {
        $this->__load();
        return parent::setCountry($country);
    }

    public function getLogin_summarysUser()
    {
        $this->__load();
        return parent::getLogin_summarysUser();
    }

    public function setLogin_summarysUser($login_summarysUser)
    {
        $this->__load();
        return parent::setLogin_summarysUser($login_summarysUser);
    }


    public function __sleep()
    {
        return array('__isInitialized__', 'id', 'login_time', 'logout_time', 'login_ip', 'country', 'login_summarysUser');
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
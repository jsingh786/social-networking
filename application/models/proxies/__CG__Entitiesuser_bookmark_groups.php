<?php

namespace Proxies\__CG__\Entities;

/**
 * THIS CLASS WAS GENERATED BY THE DOCTRINE ORM. DO NOT EDIT THIS FILE.
 */
class user_bookmark_groups extends \Entities\user_bookmark_groups implements \Doctrine\ORM\Proxy\Proxy
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

    public function getGroup_title()
    {
        $this->__load();
        return parent::getGroup_title();
    }

    public function setGroup_title($group_title)
    {
        $this->__load();
        return parent::setGroup_title($group_title);
    }

    public function getUser_groupsLink_groups()
    {
        $this->__load();
        return parent::getUser_groupsLink_groups();
    }

    public function setUser_groupsLink_groups($user_groupsLink_groups)
    {
        $this->__load();
        return parent::setUser_groupsLink_groups($user_groupsLink_groups);
    }

    public function getUser_groupsUser()
    {
        $this->__load();
        return parent::getUser_groupsUser();
    }

    public function setUser_groupsUser($user_groupsUser)
    {
        $this->__load();
        return parent::setUser_groupsUser($user_groupsUser);
    }


    public function __sleep()
    {
        return array('__isInitialized__', 'id', 'group_title', 'user_groupsLink_groups', 'user_groupsUser');
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
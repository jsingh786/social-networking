<?php

namespace Proxies\__CG__\Entities;

/**
 * THIS CLASS WAS GENERATED BY THE DOCTRINE ORM. DO NOT EDIT THIS FILE.
 */
class share extends \Entities\share implements \Doctrine\ORM\Proxy\Proxy
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

    public function getSharesWall_post()
    {
        $this->__load();
        return parent::getSharesWall_post();
    }

    public function setSharesWall_post($sharesWall_post)
    {
        $this->__load();
        return parent::setSharesWall_post($sharesWall_post);
    }

    public function getSharesShared_by()
    {
        $this->__load();
        return parent::getSharesShared_by();
    }

    public function setSharesShared_by($sharesShared_by)
    {
        $this->__load();
        return parent::setSharesShared_by($sharesShared_by);
    }

    public function getSharesSocialise_photo()
    {
        $this->__load();
        return parent::getSharesSocialise_photo();
    }

    public function setSharesSocialise_photo($sharesSocialise_photo)
    {
        $this->__load();
        return parent::setSharesSocialise_photo($sharesSocialise_photo);
    }

    public function getBlogs()
    {
        $this->__load();
        return parent::getBlogs();
    }

    public function setBlogs($blogs)
    {
        $this->__load();
        return parent::setBlogs($blogs);
    }

    public function getSocialiseAlbum()
    {
        $this->__load();
        return parent::getSocialiseAlbum();
    }

    public function setSocialiseAlbum($socialiseAlbum)
    {
        $this->__load();
        return parent::setSocialiseAlbum($socialiseAlbum);
    }

    public function getPhotoGroup()
    {
        $this->__load();
        return parent::getPhotoGroup();
    }

    public function setPhotoGroup($photoGroup)
    {
        $this->__load();
        return parent::setPhotoGroup($photoGroup);
    }


    public function __sleep()
    {
        return array('__isInitialized__', 'id', 'sharesWall_post', 'sharesShared_by', 'sharesSocialise_photo', 'blogs', 'socialiseAlbum', 'photoGroup');
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
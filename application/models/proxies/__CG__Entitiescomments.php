<?php

namespace Proxies\__CG__\Entities;

/**
 * THIS CLASS WAS GENERATED BY THE DOCTRINE ORM. DO NOT EDIT THIS FILE.
 */
class comments extends \Entities\comments implements \Doctrine\ORM\Proxy\Proxy
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

    public function getComment_text()
    {
        $this->__load();
        return parent::getComment_text();
    }

    public function setComment_text($comment_text)
    {
        $this->__load();
        return parent::setComment_text($comment_text);
    }

    public function getSame_comment_id()
    {
        $this->__load();
        return parent::getSame_comment_id();
    }

    public function setSame_comment_id($same_comment_id)
    {
        $this->__load();
        return parent::setSame_comment_id($same_comment_id);
    }

    public function getType()
    {
        $this->__load();
        return parent::getType();
    }

    public function setType($type)
    {
        $this->__load();
        return parent::setType($type);
    }

    public function getUsers_comments_visibilities()
    {
        $this->__load();
        return parent::getUsers_comments_visibilities();
    }

    public function setUsers_comments_visibilities($users_comments_visibilities)
    {
        $this->__load();
        return parent::setUsers_comments_visibilities($users_comments_visibilities);
    }

    public function getCommentsWall_post()
    {
        $this->__load();
        return parent::getCommentsWall_post();
    }

    public function setCommentsWall_post($commentsWall_post)
    {
        $this->__load();
        return parent::setCommentsWall_post($commentsWall_post);
    }

    public function getCommentsIlook_user()
    {
        $this->__load();
        return parent::getCommentsIlook_user();
    }

    public function setCommentsIlook_user($commentsIlook_user)
    {
        $this->__load();
        return parent::setCommentsIlook_user($commentsIlook_user);
    }

    public function getCommentsSocialise_photo()
    {
        $this->__load();
        return parent::getCommentsSocialise_photo();
    }

    public function setCommentsSocialise_photo($commentsSocialise_photo)
    {
        $this->__load();
        return parent::setCommentsSocialise_photo($commentsSocialise_photo);
    }

    public function getCommentsSocialise_album()
    {
        $this->__load();
        return parent::getCommentsSocialise_album();
    }

    public function setCommentsSocialise_album($commentsSocialise_album)
    {
        $this->__load();
        return parent::setCommentsSocialise_album($commentsSocialise_album);
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


    public function __sleep()
    {
        return array('__isInitialized__', 'id', 'comment_text', 'same_comment_id', 'type', 'created_at', 'users_comments_visibilities', 'commentsWall_post', 'commentsIlook_user', 'commentsSocialise_photo', 'commentsSocialise_album', 'blogs', 'photoGroup');
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
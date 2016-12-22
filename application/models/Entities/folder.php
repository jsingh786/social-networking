<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class folder
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $folder_name;

    /**
     * @ORM\OneToMany(targetEntity="Entities\user_folder", mappedBy="user_foldersFolder")
     */
    private $folderUser_folder;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersFolder")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $foldersUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getFolder_name() {
		return $this->folder_name;
	}

	public function setFolder_name($folder_name) {
		$this->folder_name = $folder_name;
	}

	public function getFolderUser_folder() {
		return $this->folderUser_folder;
	}

	public function setFolderUser_folder($folderUser_folder) {
		$this->folderUser_folder = $folderUser_folder;
	}

	public function getFoldersUser() {
		return $this->foldersUser;
	}

	public function setFoldersUser($foldersUser) {
		$this->foldersUser = $foldersUser;
	}

}